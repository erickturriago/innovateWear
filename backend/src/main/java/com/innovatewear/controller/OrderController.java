package com.innovatewear.controller;

import com.innovatewear.entity.Order;
import com.innovatewear.service.OrderService;
import com.innovatewear.utils.JsonPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) {
            LOGGER.error("Error al crear orden desde carrito: " + e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        LOGGER.info("Request para obtener todas las órdenes");
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        LOGGER.info("Request para obtener orden con ID: {}", id);
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("Orden con ID {} no encontrada.", id);
                    return ResponseEntity.notFound().build();
                });
    }
}