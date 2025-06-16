package com.innovatewear.controller;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.service.CustomDesignService;
import com.innovatewear.utils.JsonPrinter;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custom-designs")
@CrossOrigin(origins = "*")
public class CustomDesignController {

    @Autowired
    private CustomDesignService customDesignService;

    private final Logger LOGGER = LoggerFactory.getLogger(CustomDesignController.class);

    @PostMapping
    public ResponseEntity<CustomDesign> createCustomDesign(@RequestBody CustomDesign customDesign) {
        LOGGER.info("Request para crear CustomDesign: {}", JsonPrinter.toString(customDesign));
        try {
            CustomDesign createdDesign = customDesignService.createCustomDesign(customDesign);
            LOGGER.info("CustomDesign creado con ID: {}", createdDesign.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDesign);
        } catch (Exception e) {
            LOGGER.error("Error al crear CustomDesign: " + e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomDesign> updateCustomDesign(@PathVariable Long id, @RequestBody CustomDesign customDesignDetails) {
        LOGGER.info("Request para actualizar CustomDesign con ID {}: {}", id, JsonPrinter.toString(customDesignDetails));
        try {
            // Se elimina la lógica de extracción del creator.id que causaba el error
            CustomDesign updatedDesign = customDesignService.updateCustomDesign(id, customDesignDetails);
            return ResponseEntity.ok(updatedDesign);
        } catch (EntityNotFoundException e) {
            LOGGER.error("Diseño no encontrado con ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LOGGER.error("Error inesperado al actualizar CustomDesign con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}/by-artist/{artistId}")
    public ResponseEntity<Void> deactivateCustomDesign(@PathVariable Long id, @PathVariable Long artistId) {
        LOGGER.info("Request para desactivar CustomDesign con ID {} por artista {}", id, artistId);
        try {
            customDesignService.deactivateCustomDesign(id, artistId);
            LOGGER.info("CustomDesign con ID {} desactivado correctamente", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar CustomDesign con ID {} por artista {}: " + e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/public")
    public ResponseEntity<List<CustomDesign>> getPublicCustomDesigns() {
        LOGGER.info("Request para obtener todos los CustomDesigns públicos");
        List<CustomDesign> designs = customDesignService.getPublicCustomDesigns();
        return ResponseEntity.ok(designs);
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<CustomDesign>> getDesignsByCreator(@PathVariable Long creatorId) {
        LOGGER.info("Request para obtener CustomDesigns del creador con ID {}", creatorId);
        List<CustomDesign> designs = customDesignService.getCustomDesignsByCreator(creatorId);
        return ResponseEntity.ok(designs);
    }

    @PutMapping("/{id}/toggle-public")
    public ResponseEntity<CustomDesign> togglePublicStatus(@PathVariable Long id) {
        LOGGER.info("Admin request para cambiar estado público del CustomDesign con ID {}", id);
        try {
            CustomDesign updatedDesign = customDesignService.togglePublicStatus(id);
            return ResponseEntity.ok(updatedDesign);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<CustomDesign> getCustomDesignById(@PathVariable Long id) {
        LOGGER.info("Request para obtener CustomDesign con ID {}", id);
        return customDesignService.getActiveCustomDesignById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("CustomDesign con ID {} no encontrado.", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/all")
    public ResponseEntity<List<CustomDesign>> getAllCustomDesigns() {
        LOGGER.info("Admin request para obtener TODOS los CustomDesigns");
        List<CustomDesign> designs = customDesignService.getAllCustomDesigns();
        return ResponseEntity.ok(designs);
    }

    @PutMapping("/{id}/toggle-activation")
    public ResponseEntity<CustomDesign> toggleActivation(@PathVariable Long id) {
        LOGGER.info("Admin request para cambiar estado de activación del CustomDesign con ID {}", id);
        try {
            CustomDesign updatedDesign = customDesignService.toggleActivation(id);
            return ResponseEntity.ok(updatedDesign);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}