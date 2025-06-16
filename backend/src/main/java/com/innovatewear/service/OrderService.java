package com.innovatewear.service;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;
import com.innovatewear.entity.OrderItem;
import com.innovatewear.entity.User;
import com.innovatewear.repository.CustomDesignRepository;
import com.innovatewear.repository.OrderRepository;
import com.innovatewear.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomDesignRepository customDesignRepository;

    public Order createOrderFromCart(Order orderFromRequest) {
        // 1. Validar y obtener el cliente que realiza la compra
        User customer = userRepository.findById(orderFromRequest.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + orderFromRequest.getUser().getId()));

        // 2. Preparar el objeto principal de la Orden
        Order newOrder = new Order();
        newOrder.setUser(customer);
        newOrder.setCustomerName(orderFromRequest.getCustomerName());
        newOrder.setCustomerEmail(orderFromRequest.getCustomerEmail());
        newOrder.setCustomerPhone(orderFromRequest.getCustomerPhone());
        newOrder.setNotes(orderFromRequest.getNotes());
        newOrder.setStatus(OrderStatus.PENDIENTE); // Las órdenes siempre se crean como PENDIENTE

        BigDecimal totalOrderPrice = BigDecimal.ZERO;

        // 3. Procesar cada item del carrito
        if (orderFromRequest.getItems() != null && !orderFromRequest.getItems().isEmpty()) {
            for (OrderItem itemFromRequest : orderFromRequest.getItems()) {
                // Validar que el CustomDesign existe y está activo
                CustomDesign design = customDesignRepository.findByIdAndActiveTrue(itemFromRequest.getCustomDesign().getId())
                        .orElseThrow(() -> new EntityNotFoundException("El diseño personalizado con ID " + itemFromRequest.getCustomDesign().getId() + " no está disponible."));

                // Crear y configurar el nuevo OrderItem
                OrderItem newItem = new OrderItem();
                newItem.setCustomDesign(design);
                newItem.setQuantity(itemFromRequest.getQuantity());
                newItem.setSize(itemFromRequest.getSize());
                newItem.setUnitPrice(design.getPrice()); // El precio se toma de la BD, no del request

                // Enlazar el item a su orden padre
                newItem.setOrder(newOrder);

                // Añadir el item procesado a la lista de la orden
                newOrder.getItems().add(newItem);

                // Acumular el precio total
                BigDecimal subtotal = design.getPrice().multiply(BigDecimal.valueOf(itemFromRequest.getQuantity()));
                totalOrderPrice = totalOrderPrice.add(subtotal);
            }
        }

        // 4. Establecer el total final en la orden
        newOrder.setTotal(totalOrderPrice);

        // 5. Guardar la orden. La cascada se encargará de guardar los OrderItems.
        return orderRepository.save(newOrder);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + orderId));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}