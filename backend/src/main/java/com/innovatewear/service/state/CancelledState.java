package com.innovatewear.service.state;

import com.innovatewear.entity.Order;

public class CancelledState implements OrderStatusState {
    @Override
    public void handleStatusChange(Order order, Order.OrderStatus newStatus) {
        throw new IllegalStateException("Un pedido 'CANCELADO' no puede cambiar de estado.");
    }
}