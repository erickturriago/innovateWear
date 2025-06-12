package com.innovatewear.service;

import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;
import com.innovatewear.repository.OrderRepository;
import com.innovatewear.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Obtener todos los pedidos
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Obtener pedido por ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Crear nuevo pedido
    public Order createOrder(Order order) {
        // Verificar que el usuario existe
        if (order.getUser() != null && order.getUser().getId() != null) {
            if (!userRepository.existsById(order.getUser().getId())) {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        // Establecer estado inicial si no está definido
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDIENTE);
        }

        return orderRepository.save(order);
    }

    // Actualizar pedido
    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();

            existingOrder.setTotal(orderDetails.getTotal());
            existingOrder.setStatus(orderDetails.getStatus());
            existingOrder.setCustomerName(orderDetails.getCustomerName());
            existingOrder.setCustomerPhone(orderDetails.getCustomerPhone());
            existingOrder.setCustomerEmail(orderDetails.getCustomerEmail());
            existingOrder.setNotes(orderDetails.getNotes());

            return orderRepository.save(existingOrder);
        }

        throw new RuntimeException("Pedido no encontrado con ID: " + id);
    }

    // Actualizar estado del pedido
    public Order updateOrderStatus(Long id, OrderStatus newStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }

        throw new RuntimeException("Pedido no encontrado con ID: " + id);
    }

    // Eliminar pedido
    public void deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
        } else {
            throw new RuntimeException("Pedido no encontrado con ID: " + id);
        }
    }

    // Buscar pedidos por usuario
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // Buscar pedidos por estado
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    // Obtener pedidos pendientes (para admin)
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.PENDIENTE);
    }

    // Obtener pedidos en proceso
    public List<Order> getProcessingOrders() {
        return orderRepository.findByStatus(OrderStatus.PROCESANDO);
    }

    // Buscar pedidos por email del cliente
    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    // Buscar pedidos por nombre del cliente
    public List<Order> searchOrdersByCustomerName(String name) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(name);
    }

    // Buscar pedidos con filtros múltiples
    public List<Order> searchOrders(Long userId, OrderStatus status, String email) {
        return orderRepository.findOrdersWithFilters(userId, status, email);
    }

    // Buscar pedidos por rango de fechas
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate);
    }

    // Contar pedidos por estado
    public long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    // Verificar si existe pedido
    public boolean existsById(Long id) {
        return orderRepository.existsById(id);
    }
}