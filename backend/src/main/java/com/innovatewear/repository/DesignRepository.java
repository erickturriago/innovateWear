package com.innovatewear.repository;

import com.innovatewear.entity.Design;
import com.innovatewear.entity.DesignCategory;
import com.innovatewear.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignRepository extends JpaRepository<Design, Long> {
    
    // Buscar diseños activos
    List<Design> findByActiveTrue();
    
    // Buscar por categoría
    List<Design> findByCategory(DesignCategory category);
    
    // Buscar diseños activos por categoría
    List<Design> findByCategoryAndActiveTrue(DesignCategory category);
    
    // Buscar por artista
    List<Design> findByArtist(User artist);
    
    // Buscar diseños activos por artista
    List<Design> findByArtistAndActiveTrue(User artist);
    
    // Buscar por nombre (contiene texto)
    List<Design> findByNameContainingIgnoreCase(String name);
    
    // Buscar diseños activos por nombre
    List<Design> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    
    // Buscar por categoría ID
    List<Design> findByCategoryIdAndActiveTrue(Long categoryId);
    
    // Buscar por artista ID
    List<Design> findByArtistIdAndActiveTrue(Long artistId);
    
    // Buscar diseños activos por categoría y artista
    List<Design> findByCategoryAndArtistAndActiveTrue(DesignCategory category, User artist);
    
    // Query personalizada para buscar por múltiples criterios
    @Query("SELECT d FROM Design d WHERE " +
           "(:categoryId IS NULL OR d.category.id = :categoryId) AND " +
           "(:artistId IS NULL OR d.artist.id = :artistId) AND " +
           "(:name IS NULL OR d.name LIKE %:name%) AND " +
           "d.active = true")
    List<Design> findByFilters(@Param("categoryId") Long categoryId, 
                              @Param("artistId") Long artistId, 
                              @Param("name") String name);
    
    // Verificar si existe diseño activo por ID
    boolean existsByIdAndActiveTrue(Long id);
}