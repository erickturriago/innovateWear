// ruta: backend/src/main/java/com/innovatewear/service/OrderService.java
package com.innovatewear.service;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;
import com.innovatewear.entity.OrderItem;
import com.innovatewear.entity.User;
import com.innovatewear.repository.CustomDesignRepository;
import com.innovatewear.repository.OrderRepository;
import com.innovatewear.repository.UserRepository;
import com.innovatewear.service.chain.OrderValidationHandler;
import com.innovatewear.service.chain.ProductAvailabilityHandler;
import com.innovatewear.service.chain.UserValidationHandler;
import com.innovatewear.service.state.OrderStatusState;
import com.innovatewear.service.state.OrderStatusStateFactory;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.innovatewear.service.observer.OrderStatusSubject;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CustomDesignRepository customDesignRepository;
    private final OrderStatusStateFactory stateFactory;
    private final OrderStatusSubject orderStatusSubject;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CustomDesignRepository customDesignRepository,
                        OrderStatusSubject orderStatusSubject) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.customDesignRepository = customDesignRepository;
        this.stateFactory = new OrderStatusStateFactory();
        this.orderStatusSubject = orderStatusSubject;
    }

    public Order createOrderFromCart(Order orderFromRequest) {
        // 1. CONSTRUIR LA CADENA DE RESPONSABILIDAD
        OrderValidationHandler validationChain = new UserValidationHandler(userRepository);
        validationChain.setNext(new ProductAvailabilityHandler(customDesignRepository));

        // 2. EJECUTAR LA CADENA DE VALIDACIÓN
        validationChain.handle(orderFromRequest);

        // 3. SI TODAS LAS VALIDACIONES PASAN, PROCEDEMOS A CREAR LA ORDEN
        User customer = userRepository.findById(orderFromRequest.getUser().getId()).get(); // .get() es seguro
        Order newOrder = new Order();
        newOrder.setUser(customer);
        newOrder.setCustomerName(orderFromRequest.getCustomerName());
        newOrder.setCustomerEmail(orderFromRequest.getCustomerEmail());
        newOrder.setCustomerPhone(orderFromRequest.getCustomerPhone());
        newOrder.setNotes(orderFromRequest.getNotes());
        newOrder.setStatus(OrderStatus.PENDIENTE);

        BigDecimal totalOrderPrice = BigDecimal.ZERO;

        for (OrderItem itemFromRequest : orderFromRequest.getItems()) {
            CustomDesign design = customDesignRepository.findById(itemFromRequest.getCustomDesign().getId()).get(); // .get() es seguro

            OrderItem newItem = new OrderItem();
            newItem.setCustomDesign(design);
            newItem.setQuantity(itemFromRequest.getQuantity());
            newItem.setSize(itemFromRequest.getSize());
            newItem.setUnitPrice(design.getPrice());
            newItem.setOrder(newOrder);
            newOrder.getItems().add(newItem);

            BigDecimal subtotal = design.getPrice().multiply(BigDecimal.valueOf(itemFromRequest.getQuantity()));
            totalOrderPrice = totalOrderPrice.add(subtotal);
        }

        newOrder.setTotal(totalOrderPrice);
        return orderRepository.save(newOrder);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(Long orderId, String newStatusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + orderId));

        Order.OrderStatus newStatus;
        try {
            newStatus = Order.OrderStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado no válido: " + newStatusStr);
        }

        // Capturar estado anterior ANTES del cambio
        Order.OrderStatus oldStatus = order.getStatus();

        // Aplicar State pattern para validar transición
        OrderStatusState currentState = stateFactory.getState(order.getStatus());
        currentState.handleStatusChange(order, newStatus);

        // Guardar orden con nuevo estado
        Order savedOrder = orderRepository.save(order);

        // NUEVO: Notificar a observers sobre el cambio de estado
        orderStatusSubject.notifyStatusChanged(savedOrder, oldStatus, newStatus);

        return savedOrder;
    }
}