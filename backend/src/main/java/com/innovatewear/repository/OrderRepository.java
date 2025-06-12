package com.innovatewear.repository;

import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;
import com.innovatewear.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Buscar pedidos por usuario
    List<Order> findByUser(User user);

    // Buscar pedidos por usuario ID
    List<Order> findByUserId(Long userId);

    // Buscar pedidos por estado
    List<Order> findByStatus(OrderStatus status);

    // Buscar pedidos por email del cliente
    List<Order> findByCustomerEmail(String email);

    // Buscar pedidos por nombre del cliente
    List<Order> findByCustomerNameContainingIgnoreCase(String name);

    // Buscar pedidos por rango de fechas
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Buscar pedidos por estado y usuario
    List<Order> findByStatusAndUserId(OrderStatus status, Long userId);

    // Contar pedidos por estado
    long countByStatus(OrderStatus status);

    // Buscar pedidos pendientes
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);

    // Query para buscar pedidos con filtros múltiples
    @Query("SELECT o FROM Order o WHERE " +
            "(:userId IS NULL OR o.user.id = :userId) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:email IS NULL OR o.customerEmail LIKE %:email%) " +
            "ORDER BY o.createdAt DESC")
    List<Order> findOrdersWithFilters(@Param("userId") Long userId,
                                      @Param("status") OrderStatus status,
                                      @Param("email") String email);
}