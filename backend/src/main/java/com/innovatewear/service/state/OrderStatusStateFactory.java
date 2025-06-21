package com.innovatewear.service.state;

import com.innovatewear.entity.Order;
import java.util.EnumMap;
import java.util.Map;

public class OrderStatusStateFactory {
    private final Map<Order.OrderStatus, OrderStatusState> states = new EnumMap<>(Order.OrderStatus.class);

    public OrderStatusStateFactory() {
        states.put(Order.OrderStatus.PENDIENTE, new PendingState());
        states.put(Order.OrderStatus.PROCESANDO, new ProcessingState());
        states.put(Order.OrderStatus.COMPLETADO, new CompletedState());
        states.put(Order.OrderStatus.CANCELADO, new CancelledState());
    }

    public OrderStatusState getState(Order.OrderStatus status) {
        OrderStatusState state = states.get(status);
        if (state == null) {
            throw new IllegalArgumentException("Estado no soportado: " + status);
        }
        return state;
    }
}