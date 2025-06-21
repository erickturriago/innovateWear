
package com.innovatewear.service.observer;

import com.innovatewear.entity.Order;

/**
 * Observer interface para notificaciones de cambios de estado de órdenes.
 */
public interface OrderStatusObserver {

    /**
     * Método llamado cuando cambia el estado de una orden.
     * @param order La orden que cambió de estado
     * @param oldStatus Estado anterior
     * @param newStatus Nuevo estado
     */
    void onStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus);
}