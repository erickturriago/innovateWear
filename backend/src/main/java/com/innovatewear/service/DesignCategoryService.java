package com.innovatewear.service;

import com.innovatewear.entity.DesignCategory;
import com.innovatewear.repository.DesignCategoryRepository;
import com.innovatewear.service.template.BaseEntityService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DesignCategoryService extends BaseEntityService<DesignCategory, Long> {

    @Autowired
    private DesignCategoryRepository designCategoryRepository;

    // Template method implementations
    @Override
    protected JpaRepository<DesignCategory, Long> getRepository() {
        return designCategoryRepository;
    }

    @Override
    protected String getEntityName() {
        return "Categoría";
    }

    @Override
    protected void validateBeforeCreate(DesignCategory category) {
        if (designCategoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + category.getName());
        }
    }

    @Override
    protected void validateBeforeUpdate(Long id, DesignCategory categoryDetails) {
        Optional<DesignCategory> existingCategory = designCategoryRepository.findById(id);
        if (existingCategory.isPresent() && !existingCategory.get().getName().equals(categoryDetails.getName())) {
            if (designCategoryRepository.existsByName(categoryDetails.getName())) {
                throw new RuntimeException("Ya existe una categoría con el nombre: " + categoryDetails.getName());
            }
        }
    }

    @Override
    protected void updateEntityFields(DesignCategory existing, DesignCategory details) {
        // --- INICIO DE LA LÓGICA DE ACTUALIZACIÓN PARCIAL CORREGIDA ---

        // Solo actualiza el nombre si se proporciona uno, no está vacío y es diferente al actual
        if (details.getName() != null && !details.getName().isEmpty() && !existing.getName().equals(details.getName())) {
            if (designCategoryRepository.existsByName(details.getName())) {
                throw new RuntimeException("Ya existe una categoría con ese nombre: " + details.getName());
            }
            existing.setName(details.getName());
        }

        // Solo actualiza la descripción si se proporciona una
        if (details.getDescription() != null) {
            existing.setDescription(details.getDescription());
        }

        // Solo actualiza el estado 'active' si se proporciona
        if (details.getActive() != null) {
            existing.setActive(details.getActive());
        }

        // También manejamos el estado 'isArchived' por si se envía por aquí
        if (details.getIsArchived() != null) {
            existing.setIsArchived(details.getIsArchived());
        }

        // --- FIN DE LA LÓGICA DE ACTUALIZACIÓN PARCIAL ---
    }

    @Override
    protected void setEntityInactive(DesignCategory category) {
        category.setActive(false);
    }

    // Public methods using template methods
    public List<DesignCategory> getAllCategories() {
        return getAllEntities().stream()
                .filter(category -> category.getIsArchived() != null && !category.getIsArchived())
                .collect(Collectors.toList());
    }

    public List<DesignCategory> getActiveCategories() {
        return designCategoryRepository.findByActiveTrue();
    }

    public Optional<DesignCategory> getCategoryById(Long id) {
        return getEntityById(id);
    }

    public Optional<DesignCategory> getActiveCategoryById(Long id) {
        return designCategoryRepository.findById(id)
                .filter(DesignCategory::getActive);
    }

    public Optional<DesignCategory> getCategoryByName(String name) {
        return designCategoryRepository.findByNameAndActiveTrue(name);
    }

    public DesignCategory createCategory(DesignCategory category) {
        return createEntity(category);
    }

    public DesignCategory updateCategory(Long id, DesignCategory categoryDetails) {
        return updateEntity(id, categoryDetails);
    }

    public void deactivateCategory(Long id) {
        deactivateEntity(id);
    }

    public void deleteCategory(Long id) {
        if (designCategoryRepository.existsById(id)) {
            designCategoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }
    }

    public List<DesignCategory> searchCategoriesByName(String name) {
        return designCategoryRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }

    public boolean existsById(Long id) {
        return super.existsById(id);
    }

    public boolean existsByName(String name) {
        return designCategoryRepository.existsByName(name);
    }

    public void archiveCategory(Long id) {
        DesignCategory category = designCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + id));
        category.setIsArchived(true);
        category.setActive(false);
        designCategoryRepository.save(category);
    }
}