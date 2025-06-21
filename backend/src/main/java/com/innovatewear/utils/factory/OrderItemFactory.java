package com.innovatewear.utils.factory;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.entity.OrderItem;
import java.math.BigDecimal;

/**
 * Factory para crear OrderItems con cálculos automáticos.
 * Centraliza la lógica de creación y cálculo de precios.
 */
public class OrderItemFactory {

    /**
     * Crea un OrderItem básico con cálculo automático de precio total
     */
    public static OrderItem createBasicItem(CustomDesign customDesign, Integer quantity, String size) {
        OrderItem item = new OrderItem();
        item.setCustomDesign(customDesign);
        item.setQuantity(quantity);
        item.setSize(size);
        item.setUnitPrice(customDesign.getPrice());

        // Cálculo automático del precio total
        BigDecimal totalPrice = customDesign.getPrice().multiply(BigDecimal.valueOf(quantity));
        item.setTotalPrice(totalPrice);

        return item;
    }

    /**
     * Crea un OrderItem con precio unitario personalizado
     */
    public static OrderItem createWithCustomPrice(CustomDesign customDesign, Integer quantity,
                                                  String size, BigDecimal customUnitPrice) {
        OrderItem item = new OrderItem();
        item.setCustomDesign(customDesign);
        item.setQuantity(quantity);
        item.setSize(size);
        item.setUnitPrice(customUnitPrice);

        // Cálculo automático del precio total con precio personalizado
        BigDecimal totalPrice = customUnitPrice.multiply(BigDecimal.valueOf(quantity));
        item.setTotalPrice(totalPrice);

        return item;
    }

    /**
     * Crea una copia de un OrderItem existente con nueva cantidad
     */
    public static OrderItem createCopyWithNewQuantity(OrderItem original, Integer newQuantity) {
        return createBasicItem(original.getCustomDesign(), newQuantity, original.getSize());
    }

    /**
     * Valida los datos básicos antes de crear un OrderItem
     */
    private static void validateItemData(CustomDesign customDesign, Integer quantity, String size) {
        if (customDesign == null) {
            throw new IllegalArgumentException("CustomDesign no puede ser null");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        if (size == null || size.trim().isEmpty()) {
            throw new IllegalArgumentException("La talla es requerida");
        }
        if (customDesign.getPrice() == null || customDesign.getPrice().signum() <= 0) {
            throw new IllegalArgumentException("El diseño debe tener un precio válido");
        }
    }

    /**
     * Crea un OrderItem con validaciones completas
     */
    public static OrderItem createValidatedItem(CustomDesign customDesign, Integer quantity, String size) {
        validateItemData(customDesign, quantity, size);
        return createBasicItem(customDesign, quantity, size);
    }
}