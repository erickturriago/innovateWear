package com.innovatewear.repository;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.entity.User;
import com.innovatewear.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomDesignRepository extends JpaRepository<CustomDesign, Long> {

    // Buscar diseños personalizados activos
    List<CustomDesign> findByActiveTrue();

    // Buscar por artista
    List<CustomDesign> findByArtist(User artist);

    // Buscar diseños activos por artista
    List<CustomDesign> findByArtistAndActiveTrue(User artist);

    // Buscar por artista ID
    List<CustomDesign> findByArtistIdAndActiveTrue(Long artistId);

    // Buscar diseños públicos (que otros clientes pueden comprar)
    List<CustomDesign> findByIsPublicTrueAndActiveTrue();

    // Buscar diseños privados del artista
    List<CustomDesign> findByArtistIdAndIsPublicFalseAndActiveTrue(Long artistId);

    // Buscar por producto
    List<CustomDesign> findByProductAndActiveTrue(Product product);

    // Buscar por producto ID
    List<CustomDesign> findByProductIdAndActiveTrue(Long productId);

    // Buscar por nombre (contiene texto)
    List<CustomDesign> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    // Buscar diseños públicos por artista
    List<CustomDesign> findByArtistIdAndIsPublicTrueAndActiveTrue(Long artistId);

    // Query personalizada para buscar con filtros múltiples
    @Query("SELECT cd FROM CustomDesign cd WHERE " +
            "(:artistId IS NULL OR cd.artist.id = :artistId) AND " +
            "(:productId IS NULL OR cd.product.id = :productId) AND " +
            "(:isPublic IS NULL OR cd.isPublic = :isPublic) AND " +
            "(:name IS NULL OR cd.name LIKE %:name%) AND " +
            "cd.active = true " +
            "ORDER BY cd.createdAt DESC")
    List<CustomDesign> findWithFilters(@Param("artistId") Long artistId,
                                       @Param("productId") Long productId,
                                       @Param("isPublic") Boolean isPublic,
                                       @Param("name") String name);

    // Contar diseños por artista
    long countByArtistIdAndActiveTrue(Long artistId);

    // Contar diseños públicos por artista
    long countByArtistIdAndIsPublicTrueAndActiveTrue(Long artistId);

    // Verificar si existe diseño activo por ID
    boolean existsByIdAndActiveTrue(Long id);
}