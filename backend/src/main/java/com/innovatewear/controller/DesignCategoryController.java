package com.innovatewear.controller;

import com.innovatewear.entity.DesignCategory;
import com.innovatewear.service.DesignCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/design-categories")
@CrossOrigin(origins = "*")
public class DesignCategoryController {
    
    @Autowired
    private DesignCategoryService designCategoryService;
    
    // GET /api/design-categories - Obtener todas las categorías activas
    @GetMapping
    public ResponseEntity<List<DesignCategory>> getAllCategories() {
        List<DesignCategory> categories = designCategoryService.getActiveCategories();
        return ResponseEntity.ok(categories);
    }
    
    // GET /api/design-categories/all - Obtener todas las categorías (incluyendo inactivas)
    @GetMapping("/all")
    public ResponseEntity<List<DesignCategory>> getAllCategoriesIncludingInactive() {
        List<DesignCategory> categories = designCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    // GET /api/design-categories/{id} - Obtener categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<DesignCategory> getCategoryById(@PathVariable Long id) {
        Optional<DesignCategory> category = designCategoryService.getActiveCategoryById(id);
        
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/design-categories/name/{name} - Buscar categoría por nombre
    @GetMapping("/name/{name}")
    public ResponseEntity<DesignCategory> getCategoryByName(@PathVariable String name) {
        Optional<DesignCategory> category = designCategoryService.getCategoryByName(name);
        
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/design-categories - Crear nueva categoría
    @PostMapping
    public ResponseEntity<DesignCategory> createCategory(@RequestBody DesignCategory category) {
        try {
            DesignCategory createdCategory = designCategoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // PUT /api/design-categories/{id} - Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<DesignCategory> updateCategory(@PathVariable Long id, @RequestBody DesignCategory categoryDetails) {
        try {
            DesignCategory updatedCategory = designCategoryService.updateCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // DELETE /api/design-categories/{id} - Desactivar categoría (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCategory(@PathVariable Long id) {
        try {
            designCategoryService.deactivateCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE /api/design-categories/{id}/permanent - Eliminar categoría permanentemente
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteCategoryPermanently(@PathVariable Long id) {
        try {
            designCategoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/design-categories/search?name=nombreCategoria - Buscar por nombre
    @GetMapping("/search")
    public ResponseEntity<List<DesignCategory>> searchCategories(@RequestParam String name) {
        List<DesignCategory> categories = designCategoryService.searchCategoriesByName(name);
        return ResponseEntity.ok(categories);
    }
}