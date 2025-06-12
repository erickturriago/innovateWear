package com.innovatewear.repository;

import com.innovatewear.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Buscar productos activos
    List<Product> findByActiveTrue();
    
    // Buscar por tipo (antes categoría)
    List<Product> findByType(String type);
    
    // Buscar productos activos por tipo
    List<Product> findByTypeAndActiveTrue(String type);
    
    // Buscar por talla
    List<Product> findBySize(String size);
    
    // Buscar por color
    List<Product> findByColor(String color);
    
    // Buscar productos activos por tipo y talla
    List<Product> findByTypeAndSizeAndActiveTrue(String type, String size);
    
    // Buscar productos activos por color
    List<Product> findByColorAndActiveTrue(String color);
    
    // Buscar productos personalizables
    List<Product> findByCustomizableTrue();
    
    // Buscar por nombre (contiene texto)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Buscar productos activos por nombre
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% AND p.active = true")
    List<Product> findActiveProductsByName(@Param("name") String name);
    
    // Verificar si existe producto activo por ID
    boolean existsByIdAndActiveTrue(Long id);
}