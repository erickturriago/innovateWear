package com.innovatewear.service;

import com.innovatewear.entity.DesignCategory;
import com.innovatewear.repository.DesignCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignCategoryService {
    
    @Autowired
    private DesignCategoryRepository designCategoryRepository;
    
    // Obtener todas las categorías
    public List<DesignCategory> getAllCategories() {
        return designCategoryRepository.findAll();
    }
    
    // Obtener solo categorías activas
    public List<DesignCategory> getActiveCategories() {
        return designCategoryRepository.findByActiveTrue();
    }
    
    // Obtener categoría por ID
    public Optional<DesignCategory> getCategoryById(Long id) {
        return designCategoryRepository.findById(id);
    }
    
    // Obtener categoría activa por ID
    public Optional<DesignCategory> getActiveCategoryById(Long id) {
        return designCategoryRepository.findById(id)
                .filter(DesignCategory::getActive);
    }
    
    // Buscar categoría por nombre
    public Optional<DesignCategory> getCategoryByName(String name) {
        return designCategoryRepository.findByNameAndActiveTrue(name);
    }
    
    // Crear nueva categoría
    public DesignCategory createCategory(DesignCategory category) {
        // Verificar que el nombre no exista
        if (designCategoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + category.getName());
        }
        
        return designCategoryRepository.save(category);
    }
    
    // Actualizar categoría existente
    public DesignCategory updateCategory(Long id, DesignCategory categoryDetails) {
        Optional<DesignCategory> optionalCategory = designCategoryRepository.findById(id);
        
        if (optionalCategory.isPresent()) {
            DesignCategory existingCategory = optionalCategory.get();
            
            // Solo actualizar nombre si es diferente y no existe
            if (!existingCategory.getName().equals(categoryDetails.getName())) {
                if (designCategoryRepository.existsByName(categoryDetails.getName())) {
                    throw new RuntimeException("Ya existe una categoría con el nombre: " + categoryDetails.getName());
                }
                existingCategory.setName(categoryDetails.getName());
            }
            
            existingCategory.setDescription(categoryDetails.getDescription());
            existingCategory.setActive(categoryDetails.getActive());
            
            return designCategoryRepository.save(existingCategory);
        }
        
        throw new RuntimeException("Categoría no encontrada con ID: " + id);
    }
    
    // Desactivar categoría (borrado lógico)
    public void deactivateCategory(Long id) {
        Optional<DesignCategory> optionalCategory = designCategoryRepository.findById(id);
        
        if (optionalCategory.isPresent()) {
            DesignCategory category = optionalCategory.get();
            category.setActive(false);
            designCategoryRepository.save(category);
        } else {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }
    }
    
    // Eliminar categoría físicamente
    public void deleteCategory(Long id) {
        if (designCategoryRepository.existsById(id)) {
            designCategoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }
    }
    
    // Buscar categorías por nombre
    public List<DesignCategory> searchCategoriesByName(String name) {
        return designCategoryRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }
    
    // Verificar si existe categoría
    public boolean existsById(Long id) {
        return designCategoryRepository.existsById(id);
    }
    
    // Verificar si existe nombre
    public boolean existsByName(String name) {
        return designCategoryRepository.existsByName(name);
    }
}