package com.innovatewear.controller;

import com.innovatewear.entity.Product;
import com.innovatewear.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    // GET /api/products - Obtener todos los productos activos
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getActiveProducts();
        return ResponseEntity.ok(products);
    }
    
    // GET /api/products/all - Obtener todos los productos (incluyendo inactivos)
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProductsIncludingInactive() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    // GET /api/products/{id} - Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getActiveProductById(id);
        
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/products - Crear nuevo producto
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // PUT /api/products/{id} - Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // DELETE /api/products/{id} - Desactivar producto (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Long id) {
        try {
            productService.deactivateProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE /api/products/{id}/permanent - Eliminar producto permanentemente
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteProductPermanently(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/products/type/{type} - Buscar por tipo
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Product>> getProductsByType(@PathVariable String type) {
        List<Product> products = productService.getProductsByType(type);
        return ResponseEntity.ok(products);
    }
    
    // GET /api/products/size/{size} - Buscar por talla
    @GetMapping("/size/{size}")
    public ResponseEntity<List<Product>> getProductsBySize(@PathVariable String size) {
        List<Product> products = productService.getProductsBySize(size);
        return ResponseEntity.ok(products);
    }
    
    // GET /api/products/color/{color} - Buscar por color
    @GetMapping("/color/{color}")
    public ResponseEntity<List<Product>> getProductsByColor(@PathVariable String color) {
        List<Product> products = productService.getProductsByColor(color);
        return ResponseEntity.ok(products);
    }
    
    // GET /api/products/filter?type=polo&size=M - Filtrar por tipo y talla
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getProductsFiltered(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String size) {
        
        if (type != null && size != null) {
            List<Product> products = productService.getProductsByTypeAndSize(type, size);
            return ResponseEntity.ok(products);
        } else if (type != null) {
            List<Product> products = productService.getProductsByType(type);
            return ResponseEntity.ok(products);
        } else if (size != null) {
            List<Product> products = productService.getProductsBySize(size);
            return ResponseEntity.ok(products);
        } else {
            List<Product> products = productService.getActiveProducts();
            return ResponseEntity.ok(products);
        }
    }
    
    // GET /api/products/search?name=nombreProducto - Buscar por nombre
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        List<Product> products = productService.searchProductsByName(name);
        return ResponseEntity.ok(products);
    }
}