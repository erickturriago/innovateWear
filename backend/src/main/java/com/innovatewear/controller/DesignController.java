package com.innovatewear.controller;

import com.innovatewear.entity.Design;
import com.innovatewear.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/designs")
@CrossOrigin(origins = "*")
public class DesignController {
    
    @Autowired
    private DesignService designService;
    
    // GET /api/designs - Obtener todos los diseños activos
    @GetMapping
    public ResponseEntity<List<Design>> getAllDesigns() {
        List<Design> designs = designService.getActiveDesigns();
        return ResponseEntity.ok(designs);
    }
    
    // GET /api/designs/all - Obtener todos los diseños (incluyendo inactivos)
    @GetMapping("/all")
    public ResponseEntity<List<Design>> getAllDesignsIncludingInactive() {
        List<Design> designs = designService.getAllDesigns();
        return ResponseEntity.ok(designs);
    }
    
    // GET /api/designs/{id} - Obtener diseño por ID
    @GetMapping("/{id}")
    public ResponseEntity<Design> getDesignById(@PathVariable Long id) {
        Optional<Design> design = designService.getActiveDesignById(id);
        
        if (design.isPresent()) {
            return ResponseEntity.ok(design.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/designs - Crear nuevo diseño
    @PostMapping
    public ResponseEntity<Design> createDesign(@RequestBody Design design) {
        try {
            Design createdDesign = designService.createDesign(design);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // PUT /api/designs/{id} - Actualizar diseño
    @PutMapping("/{id}")
    public ResponseEntity<Design> updateDesign(@PathVariable Long id, @RequestBody Design designDetails) {
        try {
            Design updatedDesign = designService.updateDesign(id, designDetails);
            return ResponseEntity.ok(updatedDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // DELETE /api/designs/{id} - Desactivar diseño (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateDesign(@PathVariable Long id) {
        try {
            designService.deactivateDesign(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE /api/designs/{id}/permanent - Eliminar diseño permanentemente
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteDesignPermanently(@PathVariable Long id) {
        try {
            designService.deleteDesign(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/designs/category/{categoryId} - Buscar diseños por categoría
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Design>> getDesignsByCategory(@PathVariable Long categoryId) {
        List<Design> designs = designService.getDesignsByCategory(categoryId);
        return ResponseEntity.ok(designs);
    }
    
    // GET /api/designs/artist/{artistId} - Buscar diseños por artista
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Design>> getDesignsByArtist(@PathVariable Long artistId) {
        List<Design> designs = designService.getDesignsByArtist(artistId);
        return ResponseEntity.ok(designs);
    }
    
    // GET /api/designs/search?name=nombreDiseño - Buscar por nombre
    @GetMapping("/search")
    public ResponseEntity<List<Design>> searchDesignsByName(@RequestParam String name) {
        List<Design> designs = designService.searchDesignsByName(name);
        return ResponseEntity.ok(designs);
    }
    
    // GET /api/designs/filter?categoryId=1&artistId=2&name=baby - Buscar con filtros múltiples
    @GetMapping("/filter")
    public ResponseEntity<List<Design>> searchDesignsWithFilters(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long artistId,
            @RequestParam(required = false) String name) {
        
        List<Design> designs = designService.searchDesigns(categoryId, artistId, name);
        return ResponseEntity.ok(designs);
    }
}