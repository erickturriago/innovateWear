// ruta: backend/src/main/java/com/innovatewear/service/chain/ProductAvailabilityHandler.java
package com.innovatewear.service.chain;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.entity.Order;
import com.innovatewear.entity.OrderItem;
import com.innovatewear.repository.CustomDesignRepository;
import jakarta.persistence.EntityNotFoundException;

public class ProductAvailabilityHandler extends OrderValidationHandler {

    private final CustomDesignRepository customDesignRepository;

    public ProductAvailabilityHandler(CustomDesignRepository customDesignRepository) {
        this.customDesignRepository = customDesignRepository;
    }

    @Override
    public void handle(Order order) {

        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("La orden debe contener al menos un item.");
        }

        for (OrderItem item : order.getItems()) {
            // Se usa getCustomDesignId() que es el getter correcto
            CustomDesign design = customDesignRepository.findById(item.getCustomDesign().getId())
                    .orElseThrow(() -> new EntityNotFoundException("El diseño personalizado con ID " + item.getCustomDesign().getId() + " no está disponible."));

            // Se usa isEnabled() que es el getter booleano correcto generado por Lombok
            if (!design.getActive()) {
                throw new IllegalStateException("El producto con ID " + design.getId() + " no está habilitado para la venta.");
            }
        }
        handleNext(order);
    }
}