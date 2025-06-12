package com.innovatewear.controller;

import com.innovatewear.entity.CustomDesign;
import com.innovatewear.service.CustomDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/custom-designs")
@CrossOrigin(origins = "*")
public class CustomDesignController {

    @Autowired
    private CustomDesignService customDesignService;

    // GET /api/custom-designs - Obtener todos los diseños activos
    @GetMapping
    public ResponseEntity<List<CustomDesign>> getAllCustomDesigns() {
        List<CustomDesign> designs = customDesignService.getActiveCustomDesigns();
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/all - Obtener todos (incluyendo inactivos)
    @GetMapping("/all")
    public ResponseEntity<List<CustomDesign>> getAllCustomDesignsIncludingInactive() {
        List<CustomDesign> designs = customDesignService.getAllCustomDesigns();
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/{id} - Obtener diseño por ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomDesign> getCustomDesignById(@PathVariable Long id) {
        Optional<CustomDesign> design = customDesignService.getActiveCustomDesignById(id);

        if (design.isPresent()) {
            return ResponseEntity.ok(design.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/custom-designs - Crear nuevo diseño personalizado
    @PostMapping
    public ResponseEntity<CustomDesign> createCustomDesign(@RequestBody CustomDesign customDesign) {
        try {
            CustomDesign createdDesign = customDesignService.createCustomDesign(customDesign);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // PUT /api/custom-designs/{id} - Actualizar diseño
    @PutMapping("/{id}")
    public ResponseEntity<CustomDesign> updateCustomDesign(@PathVariable Long id, @RequestBody CustomDesign designDetails) {
        try {
            CustomDesign updatedDesign = customDesignService.updateCustomDesign(id, designDetails);
            return ResponseEntity.ok(updatedDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // DELETE /api/custom-designs/{id} - Desactivar diseño (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCustomDesign(@PathVariable Long id) {
        try {
            customDesignService.deactivateCustomDesign(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/custom-designs/{id}/permanent - Eliminar permanentemente
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteCustomDesignPermanently(@PathVariable Long id) {
        try {
            customDesignService.deleteCustomDesign(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/custom-designs/artist/{artistId} - Diseños por artista
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<CustomDesign>> getCustomDesignsByArtist(@PathVariable Long artistId) {
        List<CustomDesign> designs = customDesignService.getCustomDesignsByArtist(artistId);
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/public - Diseños públicos (que otros pueden comprar)
    @GetMapping("/public")
    public ResponseEntity<List<CustomDesign>> getPublicCustomDesigns() {
        List<CustomDesign> designs = customDesignService.getPublicCustomDesigns();
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/artist/{artistId}/private - Diseños privados del artista
    @GetMapping("/artist/{artistId}/private")
    public ResponseEntity<List<CustomDesign>> getPrivateCustomDesignsByArtist(@PathVariable Long artistId) {
        List<CustomDesign> designs = customDesignService.getPrivateCustomDesignsByArtist(artistId);
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/artist/{artistId}/public - Diseños públicos del artista
    @GetMapping("/artist/{artistId}/public")
    public ResponseEntity<List<CustomDesign>> getPublicCustomDesignsByArtist(@PathVariable Long artistId) {
        List<CustomDesign> designs = customDesignService.getPublicCustomDesignsByArtist(artistId);
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/product/{productId} - Diseños por producto
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CustomDesign>> getCustomDesignsByProduct(@PathVariable Long productId) {
        List<CustomDesign> designs = customDesignService.getCustomDesignsByProduct(productId);
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/search?name=nombre - Buscar por nombre
    @GetMapping("/search")
    public ResponseEntity<List<CustomDesign>> searchCustomDesignsByName(@RequestParam String name) {
        List<CustomDesign> designs = customDesignService.searchCustomDesignsByName(name);
        return ResponseEntity.ok(designs);
    }

    // GET /api/custom-designs/filter?artistId=1&productId=2&isPublic=true&name=test - Filtros múltiples
    @GetMapping("/filter")
    public ResponseEntity<List<CustomDesign>> searchCustomDesignsWithFilters(
            @RequestParam(required = false) Long artistId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Boolean isPublic,
            @RequestParam(required = false) String name) {

        List<CustomDesign> designs = customDesignService.searchCustomDesigns(artistId, productId, isPublic, name);
        return ResponseEntity.ok(designs);
    }

    // PUT /api/custom-designs/{id}/make-public - Hacer público un diseño
    @PutMapping("/{id}/make-public")
    public ResponseEntity<CustomDesign> makePublic(@PathVariable Long id) {
        try {
            CustomDesign updatedDesign = customDesignService.makePublic(id);
            return ResponseEntity.ok(updatedDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/custom-designs/{id}/make-private - Hacer privado un diseño
    @PutMapping("/{id}/make-private")
    public ResponseEntity<CustomDesign> makePrivate(@PathVariable Long id) {
        try {
            CustomDesign updatedDesign = customDesignService.makePrivate(id);
            return ResponseEntity.ok(updatedDesign);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/custom-designs/artist/{artistId}/count - Contar diseños por artista
    @GetMapping("/artist/{artistId}/count")
    public ResponseEntity<Long> countCustomDesignsByArtist(@PathVariable Long artistId) {
        long count = customDesignService.countCustomDesignsByArtist(artistId);
        return ResponseEntity.ok(count);
    }
}