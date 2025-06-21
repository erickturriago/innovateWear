package com.innovatewear.service.observer;

import com.innovatewear.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Observer que registra métricas y estadísticas de órdenes.
 */
@Component
public class MetricsOrderObserver implements OrderStatusObserver {

    private static final Logger METRICS_LOGGER = LoggerFactory.getLogger("METRICS");

    @Override
    public void onStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {

        // Métricas de conversión
        if (oldStatus == Order.OrderStatus.PENDIENTE && newStatus == Order.OrderStatus.PROCESANDO) {
            METRICS_LOGGER.info("CONVERSION_PENDING_TO_PROCESSING: order_id={}, customer={}, total={}",
                    order.getId(), order.getCustomerName(), order.getTotal());
        }

        // Métricas de completación
        if (newStatus == Order.OrderStatus.COMPLETADO) {
            METRICS_LOGGER.info("ORDER_COMPLETED: order_id={}, total_revenue={}, items_count={}, customer={}",
                    order.getId(),
                    order.getTotal(),
                    order.getItems().size(),
                    order.getCustomerName());
        }

        // Métricas de cancelación
        if (newStatus == Order.OrderStatus.CANCELADO) {
            METRICS_LOGGER.info("ORDER_CANCELLED: order_id={}, lost_revenue={}, stage={}, customer={}",
                    order.getId(),
                    order.getTotal(),
                    oldStatus,
                    order.getCustomerName());
        }

        // Métricas de tiempo en procesamiento
        if (oldStatus == Order.OrderStatus.PROCESANDO && newStatus == Order.OrderStatus.COMPLETADO) {
            METRICS_LOGGER.info("PROCESSING_COMPLETED: order_id={}, customer={}",
                    order.getId(), order.getCustomerName());
        }
    }
}
