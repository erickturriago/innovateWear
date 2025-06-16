package com.innovatewear.controller;

import com.innovatewear.entity.Design;
import com.innovatewear.service.DesignService;
import com.innovatewear.utils.JsonPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designs")
@CrossOrigin(origins = "*")
public class DesignController {

    @Autowired
    private DesignService designService;

    private final Logger LOGGER = LoggerFactory.getLogger(DesignController.class);

    @GetMapping
    public ResponseEntity<List<Design>> getAllDesigns() {
        LOGGER.info("Request para obtener todos los diseños activos");
        List<Design> designs = designService.getActiveDesigns();
        return ResponseEntity.ok(designs);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Design>> getAllDesignsIncludingInactive() {
        LOGGER.info("Request para obtener todos los diseños (incluyendo inactivos)");
        List<Design> designs = designService.getAllDesigns();
        return ResponseEntity.ok(designs);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Design> getDesignById(@PathVariable Long id) {
        LOGGER.info("Request para obtener diseño con ID: {}", id);
        return designService.getActiveDesignById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("Diseño con ID {} no encontrado.", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/by-artist/{artistId}")
    public ResponseEntity<List<Design>> getDesignsByArtist(@PathVariable Long artistId) {
        LOGGER.info("Request para obtener diseños del artista con ID: {}", artistId);
        try {
            List<Design> designs = designService.getDesignsByArtist(artistId);
            return ResponseEntity.ok(designs);
        } catch (Exception e) {
            LOGGER.error("Error al obtener diseños para el artista con ID {}: {}", artistId, e.getMessage(), e);
            // Puedes devolver una lista vacía o un error de servidor
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Design> createDesign(@RequestBody Design design) {
        LOGGER.info("Request para crear diseño: {}", JsonPrinter.toString(design));
        try {
            Design createdDesign = designService.createDesign(design);
            LOGGER.info("Diseño creado con ID: {}", createdDesign.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDesign);
        } catch (Exception e) {
            LOGGER.error("Error al crear diseño: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Design> updateDesign(@PathVariable Long id, @RequestBody Design designDetails) {
        LOGGER.info("Request para actualizar diseño con ID {}: {}", id, JsonPrinter.toString(designDetails));
        try {
            Design updatedDesign = designService.updateDesign(id, designDetails);
            return ResponseEntity.ok(updatedDesign);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateDesign(@PathVariable Long id) {
        LOGGER.info("Request para desactivar diseño con ID: {}", id);
        try {
            designService.deactivateDesign(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }
}