package com.innovatewear.service;

import com.innovatewear.entity.Design;
import com.innovatewear.entity.DesignCategory;
import com.innovatewear.entity.User;
import com.innovatewear.repository.DesignRepository;
import com.innovatewear.repository.DesignCategoryRepository;
import com.innovatewear.repository.UserRepository;
import com.innovatewear.service.template.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import com.innovatewear.service.strategy.DesignSearchContext;
import java.util.List;
import java.util.Optional;

@Service
public class DesignService extends BaseEntityService<Design, Long> {

    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private DesignCategoryRepository designCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    // Template method implementations
    @Override
    protected JpaRepository<Design, Long> getRepository() {
        return designRepository;
    }

    @Override
    protected String getEntityName() {
        return "Diseño";
    }

    @Override
    protected void validateBeforeCreate(Design design) {
        // Verificar que la categoría existe y está activa
        if (design.getCategory() != null && design.getCategory().getId() != null) {
            Optional<DesignCategory> category = designCategoryRepository.findById(design.getCategory().getId());
            if (category.isEmpty() || !category.get().getActive()) {
                throw new RuntimeException("Categoría no encontrada o inactiva");
            }
        }

        // Verificar que el artista existe y está activo
        if (design.getArtist() != null && design.getArtist().getId() != null) {
            Optional<User> artist = userRepository.findById(design.getArtist().getId());
            if (artist.isEmpty() || !artist.get().getActive()) {
                throw new RuntimeException("Artista no encontrado o inactivo");
            }
        }
    }

    @Override
    protected void validateBeforeUpdate(Long id, Design designDetails) {
        // Validar categoría si se está actualizando
        if (designDetails.getCategory() != null && designDetails.getCategory().getId() != null) {
            Optional<DesignCategory> category = designCategoryRepository.findById(designDetails.getCategory().getId());
            if (category.isEmpty() || !category.get().getActive()) {
                throw new RuntimeException("Categoría no encontrada o inactiva");
            }
        }

        // Validar artista si se está actualizando
        if (designDetails.getArtist() != null && designDetails.getArtist().getId() != null) {
            Optional<User> artist = userRepository.findById(designDetails.getArtist().getId());
            if (artist.isEmpty() || !artist.get().getActive()) {
                throw new RuntimeException("Artista no encontrado o inactivo");
            }
        }
    }

    @Override
    protected void updateEntityFields(Design existing, Design details) {
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getDescription() != null) existing.setDescription(details.getDescription());
        if (details.getPrice() != null) existing.setPrice(details.getPrice());
        if (details.getImageUrl() != null) existing.setImageUrl(details.getImageUrl());
        if (details.getActive() != null) existing.setActive(details.getActive());

        if (details.getCategory() != null && details.getCategory().getId() != null) {
            DesignCategory category = designCategoryRepository.findById(details.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada o inactiva"));
            existing.setCategory(category);
        }

        if (details.getArtist() != null && details.getArtist().getId() != null) {
            User artist = userRepository.findById(details.getArtist().getId())
                    .orElseThrow(() -> new RuntimeException("Artista no encontrado o inactivo"));
            existing.setArtist(artist);
        }
    }

    @Override
    protected void setEntityInactive(Design design) {
        design.setActive(false);
    }

    @Override
    protected void performAdditionalCreateValidations(Design design) {
        // Set entities from IDs after basic validations
        if (design.getCategory() != null && design.getCategory().getId() != null) {
            DesignCategory category = designCategoryRepository.findById(design.getCategory().getId()).get();
            design.setCategory(category);
        }

        if (design.getArtist() != null && design.getArtist().getId() != null) {
            User artist = userRepository.findById(design.getArtist().getId()).get();
            design.setArtist(artist);
        }
    }

    // Public methods using template methods
    public List<Design> getAllDesigns() {
        return getAllEntities();
    }

    public List<Design> getActiveDesigns() {
        return designRepository.findByActiveTrue();
    }

    public Optional<Design> getDesignById(Long id) {
        return getEntityById(id);
    }

    public Optional<Design> getActiveDesignById(Long id) {
        return designRepository.findById(id)
                .filter(Design::getActive);
    }

    public Design createDesign(Design design) {
        return createEntity(design);
    }

    public Design updateDesign(Long id, Design designDetails) {
        return updateEntity(id, designDetails);
    }

    public void deactivateDesign(Long id) {
        deactivateEntity(id);
    }

    public void deleteDesign(Long id) {
        if (designRepository.existsById(id)) {
            designRepository.deleteById(id);
        } else {
            throw new RuntimeException("Diseño no encontrado con ID: " + id);
        }
    }

    public List<Design> getDesignsByCategory(Long categoryId) {
        return designRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public List<Design> getDesignsByArtist(Long artistId) {
        return designRepository.findByArtistIdAndActiveTrue(artistId);
    }

    public List<Design> searchDesignsByName(String name) {
        return designRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }

    /**
     * Busca diseños aplicando múltiples filtros usando Strategy pattern.
     * @param categoryId ID de categoría (opcional)
     * @param artistId ID de artista (opcional)
     * @param name Nombre a buscar (opcional)
     * @return Lista de diseños que cumplen todos los criterios
     */
    public List<Design> searchDesigns(Long categoryId, Long artistId, String name) {
        // Obtener diseños activos como base
        List<Design> baseDesigns = designRepository.findByActiveTrue();

        // Crear contexto con strategies apropiadas
        DesignSearchContext searchContext = DesignSearchContext.createWithFilters(categoryId, artistId);

        // Ejecutar búsqueda con todas las strategies configuradas
        return searchContext.executeSearch(baseDesigns, name);
    }

    public boolean existsById(Long id) {
        return super.existsById(id);
    }
}