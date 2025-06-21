package com.innovatewear.controller;

import com.innovatewear.entity.Product;
import com.innovatewear.service.ProductService;
import com.innovatewear.utils.JsonPrinter;
import com.innovatewear.utils.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    private final Logger LOGGER = LoggerFactory.getLogger(ProductController.class);

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        LOGGER.info("Request para obtener todos los productos activos");
        List<Product> products = productService.getActiveProducts();
        return ResponseFactory.success(products);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProductsIncludingInactive() {
        LOGGER.info("Request para obtener todos los productos (incluyendo inactivos)");
        List<Product> products = productService.getAllProducts();
        return ResponseFactory.success(products);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        LOGGER.info("Request para obtener producto con ID: {}", id);
        return productService.getActiveProductById(id)
                .map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Producto con ID {} no encontrado.", id);
                    return ResponseFactory.notFound();
                });
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        LOGGER.info("Request para crear producto: {}", JsonPrinter.toString(product));
        try {
            Product createdProduct = productService.createProduct(product);
            LOGGER.info("Producto creado con ID: {}", createdProduct.getId());
            return ResponseFactory.created(createdProduct);
        } catch (Exception e) {
            LOGGER.error("Error al crear producto: {}", e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        LOGGER.info("Request para actualizar producto con ID {}: {}", id, JsonPrinter.toString(productDetails));
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseFactory.success(updatedProduct);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar producto con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Long id) {
        LOGGER.info("Request para desactivar producto con ID: {}", id);
        try {
            productService.deactivateProduct(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar producto con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }

    @DeleteMapping("/{id}/archive")
    public ResponseEntity<Void> archiveProduct(@PathVariable Long id) {
        try {
            productService.archiveProduct(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            return ResponseFactory.notFound();
        }
    }
}