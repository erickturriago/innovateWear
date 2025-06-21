package com.innovatewear.service;

import com.innovatewear.entity.Product;
import com.innovatewear.repository.ProductRepository;
import com.innovatewear.service.template.BaseEntityService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService extends BaseEntityService<Product, Long> {

    @Autowired
    private ProductRepository productRepository;

    @Override
    protected JpaRepository<Product, Long> getRepository() {
        return productRepository;
    }

    @Override
    protected String getEntityName() {
        return "Producto";
    }

    @Override
    protected void validateBeforeCreate(Product product) {
        // Validaciones específicas para producto antes de crear
        if (product.getPrice() != null && product.getPrice().signum() <= 0) {
            throw new RuntimeException("El precio debe ser mayor a 0");
        }
    }

    @Override
    protected void validateBeforeUpdate(Long id, Product productDetails) {
        // Validaciones específicas para producto antes de actualizar
        if (productDetails.getPrice() != null && productDetails.getPrice().signum() <= 0) {
            throw new RuntimeException("El precio debe ser mayor a 0");
        }
    }

    @Override
    protected void updateEntityFields(Product existing, Product details) {
        // --- LÓGICA DE ACTUALIZACIÓN PARCIAL ---
        if (details.getName() != null) {
            existing.setName(details.getName());
        }
        if (details.getDescription() != null) {
            existing.setDescription(details.getDescription());
        }
        if (details.getPrice() != null) {
            existing.setPrice(details.getPrice());
        }
        if (details.getType() != null) {
            existing.setType(details.getType());
        }
        if (details.getSize() != null) {
            existing.setSize(details.getSize());
        }
        if (details.getColor() != null) {
            existing.setColor(details.getColor());
        }
        if (details.getMaterial() != null) {
            existing.setMaterial(details.getMaterial());
        }
        if (details.getLink() != null) {
            existing.setLink(details.getLink());
        }
        if (details.getCustomizable() != null) {
            existing.setCustomizable(details.getCustomizable());
        }
        if (details.getActive() != null) {
            existing.setActive(details.getActive());
        }
    }

    @Override
    protected void setEntityInactive(Product product) {
        product.setActive(false);
    }

    // Obtener todos los productos
    public List<Product> getAllProducts() {
        return getAllEntities().stream()
                .filter(product -> product.getIsArchived() != null && !product.getIsArchived())
                .collect(Collectors.toList());
    }

    // Obtener solo productos activos
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    // Obtener producto por ID
    public Optional<Product> getProductById(Long id) {
        return getEntityById(id); // Usa método del template
    }

    // Obtener producto activo por ID
    public Optional<Product> getActiveProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getActive);
    }

    // Crear nuevo producto
    public Product createProduct(Product product) {
        return createEntity(product); // Usa template method
    }

    // Actualizar producto existente
    public Product updateProduct(Long id, Product productDetails) {
        return updateEntity(id, productDetails); // Usa template method
    }

    // Eliminar producto (borrado lógico)
    public void deactivateProduct(Long id) {
        deactivateEntity(id); // Usa template method
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
        return super.existsById(id); // Usa metodo del template
    }

    public void archiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
        product.setIsArchived(true);
        product.setActive(false);
        productRepository.save(product);
    }
}