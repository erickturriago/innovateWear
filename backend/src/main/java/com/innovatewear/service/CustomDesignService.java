package com.innovatewear.service;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.repository.CustomDesignRepository;
import com.innovatewear.repository.UserRepository;
import com.innovatewear.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomDesignService {

    @Autowired
    private CustomDesignRepository customDesignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Obtener todos los diseños personalizados
    public List<CustomDesign> getAllCustomDesigns() {
        return customDesignRepository.findAll();
    }

    // Obtener solo diseños activos
    public List<CustomDesign> getActiveCustomDesigns() {
        return customDesignRepository.findByActiveTrue();
    }

    // Obtener diseño por ID
    public Optional<CustomDesign> getCustomDesignById(Long id) {
        return customDesignRepository.findById(id);
    }

    // Obtener diseño activo por ID
    public Optional<CustomDesign> getActiveCustomDesignById(Long id) {
        return customDesignRepository.findById(id)
                .filter(CustomDesign::getActive);
    }

    // Crear nuevo diseño personalizado
    public CustomDesign createCustomDesign(CustomDesign customDesign) {
        // Verificar que el artista existe y es ARTISTA
        if (customDesign.getArtist() != null && customDesign.getArtist().getId() != null) {
            if (!userRepository.existsById(customDesign.getArtist().getId())) {
                throw new RuntimeException("Artista no encontrado");
            }
        }

        // Verificar que el producto existe
        if (customDesign.getProduct() != null && customDesign.getProduct().getId() != null) {
            if (!productRepository.existsById(customDesign.getProduct().getId())) {
                throw new RuntimeException("Producto no encontrado");
            }
        }

        return customDesignRepository.save(customDesign);
    }

    // Actualizar diseño personalizado
    public CustomDesign updateCustomDesign(Long id, CustomDesign designDetails) {
        Optional<CustomDesign> optionalDesign = customDesignRepository.findById(id);

        if (optionalDesign.isPresent()) {
            CustomDesign existingDesign = optionalDesign.get();

            existingDesign.setName(designDetails.getName());
            existingDesign.setDescription(designDetails.getDescription());
            existingDesign.setPrice(designDetails.getPrice());
            existingDesign.setIsPublic(designDetails.getIsPublic());
            existingDesign.setActive(designDetails.getActive());

            // Actualizar producto si se proporciona
            if (designDetails.getProduct() != null && designDetails.getProduct().getId() != null) {
                if (productRepository.existsById(designDetails.getProduct().getId())) {
                    existingDesign.setProduct(designDetails.getProduct());
                } else {
                    throw new RuntimeException("Producto no encontrado");
                }
            }

            return customDesignRepository.save(existingDesign);
        }

        throw new RuntimeException("Diseño personalizado no encontrado con ID: " + id);
    }

    // Desactivar diseño (borrado lógico)
    public void deactivateCustomDesign(Long id) {
        Optional<CustomDesign> optionalDesign = customDesignRepository.findById(id);

        if (optionalDesign.isPresent()) {
            CustomDesign design = optionalDesign.get();
            design.setActive(false);
            customDesignRepository.save(design);
        } else {
            throw new RuntimeException("Diseño personalizado no encontrado con ID: " + id);
        }
    }

    // Eliminar diseño físicamente
    public void deleteCustomDesign(Long id) {
        if (customDesignRepository.existsById(id)) {
            customDesignRepository.deleteById(id);
        } else {
            throw new RuntimeException("Diseño personalizado no encontrado con ID: " + id);
        }
    }

    // Buscar diseños por artista
    public List<CustomDesign> getCustomDesignsByArtist(Long artistId) {
        return customDesignRepository.findByArtistIdAndActiveTrue(artistId);
    }

    // Buscar diseños públicos (para que otros clientes los compren)
    public List<CustomDesign> getPublicCustomDesigns() {
        return customDesignRepository.findByIsPublicTrueAndActiveTrue();
    }

    // Buscar diseños privados del artista
    public List<CustomDesign> getPrivateCustomDesignsByArtist(Long artistId) {
        return customDesignRepository.findByArtistIdAndIsPublicFalseAndActiveTrue(artistId);
    }

    // Buscar diseños públicos por artista
    public List<CustomDesign> getPublicCustomDesignsByArtist(Long artistId) {
        return customDesignRepository.findByArtistIdAndIsPublicTrueAndActiveTrue(artistId);
    }

    // Buscar por producto
    public List<CustomDesign> getCustomDesignsByProduct(Long productId) {
        return customDesignRepository.findByProductIdAndActiveTrue(productId);
    }

    // Buscar por nombre
    public List<CustomDesign> searchCustomDesignsByName(String name) {
        return customDesignRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }

    // Buscar con filtros múltiples
    public List<CustomDesign> searchCustomDesigns(Long artistId, Long productId, Boolean isPublic, String name) {
        return customDesignRepository.findWithFilters(artistId, productId, isPublic, name);
    }

    // Hacer público un diseño
    public CustomDesign makePublic(Long id) {
        Optional<CustomDesign> optionalDesign = customDesignRepository.findById(id);

        if (optionalDesign.isPresent()) {
            CustomDesign design = optionalDesign.get();
            design.setIsPublic(true);
            return customDesignRepository.save(design);
        }

        throw new RuntimeException("Diseño personalizado no encontrado con ID: " + id);
    }

    // Hacer privado un diseño
    public CustomDesign makePrivate(Long id) {
        Optional<CustomDesign> optionalDesign = customDesignRepository.findById(id);

        if (optionalDesign.isPresent()) {
            CustomDesign design = optionalDesign.get();
            design.setIsPublic(false);
            return customDesignRepository.save(design);
        }

        throw new RuntimeException("Diseño personalizado no encontrado con ID: " + id);
    }

    // Contar diseños por artista
    public long countCustomDesignsByArtist(Long artistId) {
        return customDesignRepository.countByArtistIdAndActiveTrue(artistId);
    }

    // Verificar si existe diseño
    public boolean existsById(Long id) {
        return customDesignRepository.existsById(id);
    }
}