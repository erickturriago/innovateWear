package com.innovatewear.service;

import com.innovatewear.entity.Design;
import com.innovatewear.entity.DesignCategory;
import com.innovatewear.entity.User;
import com.innovatewear.repository.DesignRepository;
import com.innovatewear.repository.DesignCategoryRepository;
import com.innovatewear.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignService {
    
    @Autowired
    private DesignRepository designRepository;
    
    @Autowired
    private DesignCategoryRepository designCategoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Obtener todos los diseños
    public List<Design> getAllDesigns() {
        return designRepository.findAll();
    }
    
    // Obtener solo diseños activos
    public List<Design> getActiveDesigns() {
        return designRepository.findByActiveTrue();
    }
    
    // Obtener diseño por ID
    public Optional<Design> getDesignById(Long id) {
        return designRepository.findById(id);
    }
    
    // Obtener diseño activo por ID
    public Optional<Design> getActiveDesignById(Long id) {
        return designRepository.findById(id)
                .filter(Design::getActive);
    }
    
    // Crear nuevo diseño
    public Design createDesign(Design design) {
        // Verificar que la categoría existe y está activa
        if (design.getCategory() != null && design.getCategory().getId() != null) {
            Optional<DesignCategory> category = designCategoryRepository.findById(design.getCategory().getId());
            if (category.isEmpty() || !category.get().getActive()) {
                throw new RuntimeException("Categoría no encontrada o inactiva");
            }
            design.setCategory(category.get());
        }
        
        // Verificar que el artista existe y está activo
        if (design.getArtist() != null && design.getArtist().getId() != null) {
            Optional<User> artist = userRepository.findById(design.getArtist().getId());
            if (artist.isEmpty() || !artist.get().getActive()) {
                throw new RuntimeException("Artista no encontrado o inactivo");
            }
            design.setArtist(artist.get());
        }
        
        return designRepository.save(design);
    }
    
    // Actualizar diseño existente
    public Design updateDesign(Long id, Design designDetails) {
        Design existingDesign = designRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diseño no encontrado con ID: " + id));

        if (designDetails.getName() != null) existingDesign.setName(designDetails.getName());
        if (designDetails.getDescription() != null) existingDesign.setDescription(designDetails.getDescription());
        if (designDetails.getPrice() != null) existingDesign.setPrice(designDetails.getPrice());
        if (designDetails.getImageUrl() != null) existingDesign.setImageUrl(designDetails.getImageUrl());
        if (designDetails.getActive() != null) existingDesign.setActive(designDetails.getActive());

        if (designDetails.getCategory() != null && designDetails.getCategory().getId() != null) {
            DesignCategory category = designCategoryRepository.findById(designDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada o inactiva"));
            existingDesign.setCategory(category);
        }
        if (designDetails.getArtist() != null && designDetails.getArtist().getId() != null) {
            User artist = userRepository.findById(designDetails.getArtist().getId())
                    .orElseThrow(() -> new RuntimeException("Artista no encontrado o inactivo"));
            existingDesign.setArtist(artist);
        }

        return designRepository.save(existingDesign);
    }
    
    // Desactivar diseño (borrado lógico)
    public void deactivateDesign(Long id) {
        Optional<Design> optionalDesign = designRepository.findById(id);
        
        if (optionalDesign.isPresent()) {
            Design design = optionalDesign.get();
            design.setActive(false);
            designRepository.save(design);
        } else {
            throw new RuntimeException("Diseño no encontrado con ID: " + id);
        }
    }
    
    // Eliminar diseño físicamente
    public void deleteDesign(Long id) {
        if (designRepository.existsById(id)) {
            designRepository.deleteById(id);
        } else {
            throw new RuntimeException("Diseño no encontrado con ID: " + id);
        }
    }
    
    // Buscar diseños por categoría
    public List<Design> getDesignsByCategory(Long categoryId) {
        return designRepository.findByCategoryIdAndActiveTrue(categoryId);
    }
    
    // Buscar diseños por artista
    public List<Design> getDesignsByArtist(Long artistId) {
        return designRepository.findByArtistIdAndActiveTrue(artistId);
    }
    
    // Buscar diseños por nombre
    public List<Design> searchDesignsByName(String name) {
        return designRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }
    
    // Buscar con filtros múltiples (implementación simple)
    public List<Design> searchDesigns(Long categoryId, Long artistId, String name) {
        List<Design> designs = designRepository.findByActiveTrue();
        
        if (categoryId != null) {
            designs = designs.stream()
                .filter(d -> d.getCategory().getId().equals(categoryId))
                .toList();
        }
        
        if (artistId != null) {
            designs = designs.stream()
                .filter(d -> d.getArtist().getId().equals(artistId))
                .toList();
        }
        
        if (name != null && !name.trim().isEmpty()) {
            designs = designs.stream()
                .filter(d -> d.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
        }
        
        return designs;
    }
    
    // Verificar si existe diseño
    public boolean existsById(Long id) {
        return designRepository.existsById(id);
    }
}