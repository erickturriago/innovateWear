package com.innovatewear.controller;

import com.innovatewear.entity.Order;
import com.innovatewear.service.OrderService;
import com.innovatewear.utils.JsonPrinter;
import com.innovatewear.utils.factory.ResponseFactory;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

    @PostMapping("/create-from-cart")
    public ResponseEntity<Order> createOrderFromCart(@RequestBody Order orderRequest) {
        LOGGER.info("Request para crear orden desde carrito: {}", JsonPrinter.toString(orderRequest));
        try {
            Order createdOrder = orderService.createOrderFromCart(orderRequest);
            LOGGER.info("Orden creada con ID: {}", createdOrder.getId());
            return ResponseFactory.created(createdOrder);
        } catch (Exception e) {
            LOGGER.error("Error al crear orden desde carrito: {}", e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        LOGGER.info("Request para obtener todas las órdenes");
        List<Order> orders = orderService.getAllOrders();
        return ResponseFactory.success(orders);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        LOGGER.info("Request para obtener orden con ID: {}", id);
        return orderService.getOrderById(id)
                .map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Orden con ID {} no encontrada.", id);
                    return ResponseFactory.notFound();
                });
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody String newStatus) {
        LOGGER.info("Admin request para actualizar estado del pedido {} a {}", id, newStatus);

        try {
            Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
            return ResponseFactory.success(updatedOrder);
        } catch (IllegalArgumentException | IllegalStateException e) {
            LOGGER.error("Error de validación al actualizar estado del pedido {}: {}", id, e.getMessage());
            return ResponseFactory.badRequest();
        } catch (EntityNotFoundException e) {
            LOGGER.error("Pedido no encontrado con ID {}: {}", id, e.getMessage());
            return ResponseFactory.notFound();
        }
    }
}