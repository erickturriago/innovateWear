package com.innovatewear.service.observer;

import com.innovatewear.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Subject que notifica a observers sobre cambios de estado de órdenes.
 */
@Component
public class OrderStatusSubject {

    private final List<OrderStatusObserver> observers;

    @Autowired
    public OrderStatusSubject(LoggingOrderObserver loggingObserver,
                              MetricsOrderObserver metricsObserver,
                              BusinessNotificationObserver businessObserver) {
        this.observers = new ArrayList<>();

        // Registrar observers automáticamente
        addObserver(loggingObserver);
        addObserver(metricsObserver);
        addObserver(businessObserver);
    }

    /**
     * Añade un observer a la lista de notificaciones.
     */
    public void addObserver(OrderStatusObserver observer) {
        observers.add(observer);
    }

    /**
     * Remueve un observer de la lista de notificaciones.
     */
    public void removeObserver(OrderStatusObserver observer) {
        observers.remove(observer);
    }

    /**
     * Notifica a todos los observers sobre un cambio de estado.
     */
    public void notifyStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        for (OrderStatusObserver observer : observers) {
            try {
                observer.onStatusChanged(order, oldStatus, newStatus);
            } catch (Exception e) {
                // Log error pero continúa con otros observers
                org.slf4j.LoggerFactory.getLogger(OrderStatusSubject.class)
                        .error("Error notificando observer {}: {}", observer.getClass().getSimpleName(), e.getMessage());
            }
        }
    }
}