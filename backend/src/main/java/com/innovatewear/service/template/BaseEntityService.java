package com.innovatewear.service.template;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public abstract class BaseEntityService<T, ID> {

    // =====================================================
    // MÉTODOS ABSTRACTOS - Cada servicio debe implementar
    // =====================================================

    protected abstract JpaRepository<T, ID> getRepository();
    protected abstract void validateBeforeCreate(T entity);
    protected abstract void validateBeforeUpdate(ID id, T entity);
    protected abstract void updateEntityFields(T existing, T details);
    protected abstract void setEntityInactive(T entity);
    protected abstract String getEntityName();

    // =====================================================
    // TEMPLATE METHODS - Algoritmos comunes predefinidos
    // =====================================================

    /**
     * Template method para crear entidad.
     * Define el algoritmo: validar -> hook adicional -> guardar
     */
    public final T createEntity(T entity) {
        validateBeforeCreate(entity);
        performAdditionalCreateValidations(entity);
        return getRepository().save(entity);
    }

    /**
     * Template method para actualizar entidad.
     * Define el algoritmo: buscar -> validar -> actualizar campos -> hook -> guardar
     */
    public final T updateEntity(ID id, T entityDetails) {
        T existingEntity = getRepository().findById(id)
                .orElseThrow(() -> new RuntimeException(getEntityName() + " no encontrado con ID: " + id));

        validateBeforeUpdate(id, entityDetails);
        updateEntityFields(existingEntity, entityDetails);
        performAdditionalUpdateValidations(existingEntity);

        return getRepository().save(existingEntity);
    }

    /**
     * Template method para desactivar entidad.
     * Define el algoritmo: buscar -> desactivar -> guardar
     */
    public final void deactivateEntity(ID id) {
        T entity = getRepository().findById(id)
                .orElseThrow(() -> new RuntimeException(getEntityName() + " no encontrado con ID: " + id));

        setEntityInactive(entity);
        getRepository().save(entity);
    }

    // =====================================================
    // MÉTODOS COMUNES - Implementación base para todos
    // =====================================================

    public List<T> getAllEntities() {
        return getRepository().findAll();
    }

    public Optional<T> getEntityById(ID id) {
        return getRepository().findById(id);
    }

    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }

    // =====================================================
    // HOOK METHODS - Opcionales, se pueden sobrescribir
    // =====================================================

    /**
     * Hook method que se ejecuta después de validaciones básicas de creación.
     * Override si necesitas validaciones adicionales específicas.
     */
    protected void performAdditionalCreateValidations(T entity) {
        // Implementación vacía por defecto
    }

    /**
     * Hook method que se ejecuta después de actualizar campos.
     * Override si necesitas validaciones adicionales específicas.
     */
    protected void performAdditionalUpdateValidations(T entity) {
        // Implementación vacía por defecto
    }
}