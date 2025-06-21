package com.innovatewear.service.observer;

import com.innovatewear.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Observer que maneja notificaciones específicas del negocio.
 */
@Component
public class BusinessNotificationObserver implements OrderStatusObserver {

    private static final Logger BUSINESS_LOGGER = LoggerFactory.getLogger("BUSINESS_NOTIFICATIONS");

    @Override
    public void onStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {

        switch (newStatus) {
            case PROCESANDO:
                handleProcessingNotification(order);
                break;

            case COMPLETADO:
                handleCompletedNotification(order);
                break;

            case CANCELADO:
                handleCancelledNotification(order, oldStatus);
                break;

            default:
                // No action needed for PENDIENTE
                break;
        }
    }

    private void handleProcessingNotification(Order order) {
        BUSINESS_LOGGER.info("NOTIFICAR_ARTISTAS: Orden {} en procesamiento - Notificar a artistas de los diseños",
                order.getId());

        // Aquí se podría integrar con sistema de emails, webhooks, etc.
        BUSINESS_LOGGER.debug("Preparar notificación para artistas involucrados en orden {}", order.getId());
    }

    private void handleCompletedNotification(Order order) {
        BUSINESS_LOGGER.info("NOTIFICAR_CLIENTE: Orden {} completada - Enviar confirmación a {}",
                order.getId(), order.getCustomerEmail());

        BUSINESS_LOGGER.info("ACTUALIZAR_INVENTARIO: Procesar actualización de inventario para orden {}",
                order.getId());
    }

    private void handleCancelledNotification(Order order, Order.OrderStatus oldStatus) {
        BUSINESS_LOGGER.warn("NOTIFICAR_CANCELACION: Orden {} cancelada desde estado {} - Notificar stakeholders",
                order.getId(), oldStatus);

        if (oldStatus == Order.OrderStatus.PROCESANDO) {
            BUSINESS_LOGGER.info("LIBERAR_RECURSOS: Orden {} estaba en procesamiento - Liberar recursos asignados",
                    order.getId());
        }
    }
}