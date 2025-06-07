package com.innovatewear.service;

import com.innovatewear.entity.Product;
import com.innovatewear.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Obtener todos los productos
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // Obtener solo productos activos
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    // Obtener producto por ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    // Obtener producto activo por ID
    public Optional<Product> getActiveProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getActive);
    }
    
    // Crear nuevo producto
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    // Actualizar producto existente
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setType(productDetails.getType());
            existingProduct.setSize(productDetails.getSize());
            existingProduct.setColor(productDetails.getColor());
            existingProduct.setMaterial(productDetails.getMaterial());
            existingProduct.setCustomizable(productDetails.getCustomizable());
            existingProduct.setActive(productDetails.getActive());
            
            return productRepository.save(existingProduct);
        }
        
        throw new RuntimeException("Producto no encontrado con ID: " + id);
    }
    
    // Eliminar producto (borrado lógico)
    public void deactivateProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setActive(false);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
    }
    
    // Eliminar producto físicamente
    public void deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
    }
    
    // Buscar por tipo
    public List<Product> getProductsByType(String type) {
        return productRepository.findByTypeAndActiveTrue(type);
    }
    
    // Buscar por talla
    public List<Product> getProductsBySize(String size) {
        return productRepository.findBySize(size);
    }
    
    // Buscar por color
    public List<Product> getProductsByColor(String color) {
        return productRepository.findByColorAndActiveTrue(color);
    }
    
    // Buscar por tipo y talla
    public List<Product> getProductsByTypeAndSize(String type, String size) {
        return productRepository.findByTypeAndSizeAndActiveTrue(type, size);
    }
    
    // Buscar por nombre
    public List<Product> searchProductsByName(String name) {
        return productRepository.findActiveProductsByName(name);
    }
    
    // Verificar si existe producto
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }
}