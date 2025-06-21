package com.innovatewear.service.state;

import com.innovatewear.entity.Order;

public class CompletedState implements OrderStatusState {
    @Override
    public void handleStatusChange(Order order, Order.OrderStatus newStatus) {
        throw new IllegalStateException("Un pedido 'COMPLETADO' no puede cambiar de estado.");
    }
}