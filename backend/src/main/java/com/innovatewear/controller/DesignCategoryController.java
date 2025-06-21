package com.innovatewear.controller;

import com.innovatewear.entity.DesignCategory;
import com.innovatewear.service.DesignCategoryService;
import com.innovatewear.utils.JsonPrinter;
import com.innovatewear.utils.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/design-categories")
@CrossOrigin(origins = "*")
public class DesignCategoryController {

    @Autowired
    private DesignCategoryService designCategoryService;

    private final Logger LOGGER = LoggerFactory.getLogger(DesignCategoryController.class);

    @GetMapping
    public ResponseEntity<List<DesignCategory>> getAllCategories() {
        LOGGER.info("Request para obtener todas las categorías de diseño activas");
        List<DesignCategory> categories = designCategoryService.getActiveCategories();
        return ResponseFactory.success(categories);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DesignCategory>> getAllCategoriesIncludingInactive() {
        LOGGER.info("Request para obtener todas las categorías de diseño (incluyendo inactivas)");
        List<DesignCategory> categories = designCategoryService.getAllCategories();
        return ResponseFactory.success(categories);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<DesignCategory> getCategoryById(@PathVariable Long id) {
        LOGGER.info("Request para obtener categoría de diseño con ID: {}", id);
        return designCategoryService.getActiveCategoryById(id)
                .map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Categoría de diseño con ID {} no encontrada.", id);
                    return ResponseFactory.notFound();
                });
    }

    @PostMapping
    public ResponseEntity<DesignCategory> createCategory(@RequestBody DesignCategory category) {
        LOGGER.info("Request para crear categoría de diseño: {}", JsonPrinter.toString(category));
        try {
            DesignCategory createdCategory = designCategoryService.createCategory(category);
            LOGGER.info("Categoría de diseño creada con ID: {}", createdCategory.getId());
            return ResponseFactory.created(createdCategory);
        } catch (Exception e) {
            LOGGER.error("Error al crear categoría de diseño: {}", e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesignCategory> updateCategory(@PathVariable Long id, @RequestBody DesignCategory categoryDetails) {
        LOGGER.info("Request para actualizar categoría de diseño con ID {}: {}", id, JsonPrinter.toString(categoryDetails));
        try {
            DesignCategory updatedCategory = designCategoryService.updateCategory(id, categoryDetails);
            return ResponseFactory.success(updatedCategory);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar categoría de diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCategory(@PathVariable Long id) {
        LOGGER.info("Request para desactivar categoría de diseño con ID: {}", id);
        try {
            designCategoryService.deactivateCategory(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar categoría de diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }

    @DeleteMapping("/{id}/archive")
    public ResponseEntity<Void> archiveProduct(@PathVariable Long id) {
        try {
            designCategoryService.archiveCategory(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            return ResponseFactory.notFound();
        }
    }
}