package com.innovatewear.service.strategy;

import com.innovatewear.entity.Design;
import java.util.List;

/**
 * Strategy interface para diferentes algoritmos de búsqueda de diseños.
 */
public interface DesignSearchStrategy {

    /**
     * Filtra una lista de diseños basado en criterios específicos.
     * @param designs Lista base de diseños a filtrar
     * @param criteria Criterio de búsqueda específico del strategy
     * @return Lista filtrada de diseños
     */
    List<Design> filter(List<Design> designs, String criteria);

    /**
     * Indica si este strategy puede manejar el criterio dado.
     * @param criteria Criterio a evaluar
     * @return true si puede manejar el criterio, false en caso contrario
     */
    boolean canHandle(String criteria);
}