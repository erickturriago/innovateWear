package com.innovatewear.controller;

import com.innovatewear.entity.Design;
import com.innovatewear.service.DesignService;
import com.innovatewear.utils.JsonPrinter;
import com.innovatewear.utils.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        return ResponseFactory.success(designs);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Design>> getAllDesignsIncludingInactive() {
        LOGGER.info("Request para obtener todos los diseños (incluyendo inactivos)");
        List<Design> designs = designService.getAllDesigns();
        return ResponseFactory.success(designs);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Design> getDesignById(@PathVariable Long id) {
        LOGGER.info("Request para obtener diseño con ID: {}", id);
        return designService.getActiveDesignById(id)
                .map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Diseño con ID {} no encontrado.", id);
                    return ResponseFactory.notFound();
                });
    }

    @GetMapping("/by-artist/{artistId}")
    public ResponseEntity<List<Design>> getDesignsByArtist(@PathVariable Long artistId) {
        LOGGER.info("Request para obtener diseños del artista con ID: {}", artistId);
        try {
            List<Design> designs = designService.getDesignsByArtist(artistId);
            return ResponseFactory.success(designs);
        } catch (Exception e) {
            LOGGER.error("Error al obtener diseños para el artista con ID {}: {}", artistId, e.getMessage(), e);
            return ResponseFactory.internalServerError();
        }
    }

    @PostMapping
    public ResponseEntity<Design> createDesign(@RequestBody Design design) {
        LOGGER.info("Request para crear diseño: {}", JsonPrinter.toString(design));
        try {
            Design createdDesign = designService.createDesign(design);
            LOGGER.info("Diseño creado con ID: {}", createdDesign.getId());
            return ResponseFactory.created(createdDesign);
        } catch (Exception e) {
            LOGGER.error("Error al crear diseño: {}", e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Design> updateDesign(@PathVariable Long id, @RequestBody Design designDetails) {
        LOGGER.info("Request para actualizar diseño con ID {}: {}", id, JsonPrinter.toString(designDetails));
        try {
            Design updatedDesign = designService.updateDesign(id, designDetails);
            return ResponseFactory.success(updatedDesign);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateDesign(@PathVariable Long id) {
        LOGGER.info("Request para desactivar diseño con ID: {}", id);
        try {
            designService.deactivateDesign(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar diseño con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }
}