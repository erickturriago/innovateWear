package com.innovatewear.service.observer;

import com.innovatewear.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Observer que registra cambios de estado en logs.
 */
@Component
public class LoggingOrderObserver implements OrderStatusObserver {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingOrderObserver.class);

    @Override
    public void onStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        LOGGER.info("Orden ID {} cambió de estado: {} -> {} | Cliente: {} | Total: ${}",
                order.getId(),
                oldStatus,
                newStatus,
                order.getCustomerName(),
                order.getTotal());

        // Log adicional para estados importantes
        if (newStatus == Order.OrderStatus.COMPLETADO) {
            LOGGER.info("ORDEN COMPLETADA - ID: {} | Cliente: {} | Items: {} | Total: ${}",
                    order.getId(),
                    order.getCustomerName(),
                    order.getItems().size(),
                    order.getTotal());
        }

        if (newStatus == Order.OrderStatus.CANCELADO) {
            LOGGER.warn("ORDEN CANCELADA - ID: {} | Cliente: {} | Motivo: Estado cambiado a CANCELADO",
                    order.getId(),
                    order.getCustomerName());
        }
    }
}