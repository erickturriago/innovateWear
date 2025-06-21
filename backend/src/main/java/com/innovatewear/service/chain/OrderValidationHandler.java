package com.innovatewear.service.chain;

import com.innovatewear.entity.Order;

public abstract class OrderValidationHandler {
    protected OrderValidationHandler next;

    public void setNext(OrderValidationHandler next) {
        this.next = next;
    }

    /**
     * Ejecuta la validación específica de este manejador.
     * Si la validación falla, debe lanzar una excepción.
     * Si la validación pasa, debe llamar al siguiente manejador en la cadena.
     * @param order La orden a validar.
     */
    public abstract void handle(Order order);

    protected void handleNext(Order order) {
        if (next != null) {
            next.handle(order);
        }
    }
}