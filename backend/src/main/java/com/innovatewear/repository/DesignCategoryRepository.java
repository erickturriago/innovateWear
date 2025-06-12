package com.innovatewear.repository;

import com.innovatewear.entity.DesignCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignCategoryRepository extends JpaRepository<DesignCategory, Long> {
    
    // Buscar categorías activas
    List<DesignCategory> findByActiveTrue();
    
    // Buscar por nombre
    Optional<DesignCategory> findByName(String name);
    
    // Buscar por nombre (activas)
    Optional<DesignCategory> findByNameAndActiveTrue(String name);
    
    // Verificar si existe por nombre
    boolean existsByName(String name);
    
    // Buscar por nombre que contenga texto
    List<DesignCategory> findByNameContainingIgnoreCase(String name);
    
    // Buscar categorías activas por nombre que contenga texto
    List<DesignCategory> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    
    // Verificar si existe categoría activa por ID
    boolean existsByIdAndActiveTrue(Long id);
}