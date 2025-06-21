
package com.innovatewear.service.strategy;

import com.innovatewear.entity.Design;
import java.util.ArrayList;
import java.util.List;

/**
 * Context class que coordina múltiples strategies de búsqueda.
 */
public class DesignSearchContext {

    private final List<DesignSearchStrategy> strategies;

    public DesignSearchContext() {
        this.strategies = new ArrayList<>();
    }

    /**
     * Añade una strategy al contexto de búsqueda.
     */
    public void addStrategy(DesignSearchStrategy strategy) {
        this.strategies.add(strategy);
    }

    /**
     * Ejecuta todas las strategies aplicables sobre la lista de diseños.
     * @param designs Lista base de diseños
     * @param nameCriteria Criterio de búsqueda por nombre (puede ser null)
     * @return Lista filtrada por todas las strategies aplicables
     */
    public List<Design> executeSearch(List<Design> designs, String nameCriteria) {
        List<Design> result = new ArrayList<>(designs);

        // Aplicar todas las strategies configuradas
        for (DesignSearchStrategy strategy : strategies) {
            if (strategy.canHandle(nameCriteria)) {
                result = strategy.filter(result, nameCriteria);
            } else {
                // Para strategies que no dependen de criterio de texto (como category/artist)
                result = strategy.filter(result, null);
            }
        }

        return result;
    }

    /**
     * Factory method para crear contexto con strategies comunes.
     */
    public static DesignSearchContext createWithFilters(Long categoryId, Long artistId) {
        DesignSearchContext context = new DesignSearchContext();

        if (categoryId != null) {
            context.addStrategy(new CategorySearchStrategy(categoryId));
        }

        if (artistId != null) {
            context.addStrategy(new ArtistSearchStrategy(artistId));
        }

        // Siempre incluir strategy de nombre (manejará null apropiadamente)
        context.addStrategy(new NameSearchStrategy());

        return context;
    }
}