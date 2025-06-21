package com.innovatewear.service.state;

import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;

public class PendingState implements OrderStatusState {
    @Override
    public void handleStatusChange(Order order, OrderStatus newStatus) {

        if (newStatus == OrderStatus.PROCESANDO || newStatus == OrderStatus.CANCELADO) {
            order.setStatus(newStatus);
        } else {
            throw new IllegalStateException("Desde 'PENDIENTE' solo se puede pasar a 'PROCESANDO' o 'CANCELADO'.");
        }
    }
}