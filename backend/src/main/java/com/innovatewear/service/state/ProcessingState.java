package com.innovatewear.service.state;

import com.innovatewear.entity.Order;
import com.innovatewear.entity.Order.OrderStatus;

public class ProcessingState implements OrderStatusState {
    @Override
    public void handleStatusChange(Order order, OrderStatus newStatus) {
        if (newStatus == OrderStatus.COMPLETADO || newStatus == OrderStatus.CANCELADO) {
            order.setStatus(newStatus);
        } else {
            throw new IllegalStateException("Desde 'PROCESANDO' solo se puede pasar a 'COMPLETADO' o 'CANCELADO'.");
        }
    }
}