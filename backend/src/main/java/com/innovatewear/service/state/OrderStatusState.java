package com.innovatewear.service.state;

import com.innovatewear.entity.Order;

public interface OrderStatusState {
    /**
     * Maneja la solicitud de transición a un nuevo estado.
     * @param order El objeto de la orden a modificar.
     * @param newStatus El nuevo estado al que se desea transicionar.
     * @throws IllegalStateException si la transición no es válida.
     */
    void handleStatusChange(Order order, Order.OrderStatus newStatus);
}