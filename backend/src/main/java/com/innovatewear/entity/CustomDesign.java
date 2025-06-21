package com.innovatewear.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "custom_designs")
@Data
@NoArgsConstructor // Lombok genera el constructor sin argumentos (requerido por JPA)
public class CustomDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User creator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @Column(nullable = false)
    private Boolean isPublic = false;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "is_archived", nullable = false)
    private Boolean isArchived = false;

    @OneToMany(mappedBy = "customDesign", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CustomDesignPrint> prints = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "preview_image_url", length = 500)
    private String previewImageUrl;

    // --- Constructor privado para ser usado solo por el Builder ---
    private CustomDesign(CustomDesignBuilder builder) {
        this.name = builder.name;
        this.description = builder.description;
        this.price = builder.price;
        this.creator = builder.creator;
        this.product = builder.product;
        this.isPublic = builder.isPublic;
        this.previewImageUrl = builder.previewImageUrl;
        this.active = true; // Valor por defecto al crear
    }


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Patrón Builder como clase interna estática ---
    public static class CustomDesignBuilder {
        private String name;
        private String description;
        private BigDecimal price;
        private final User creator;
        private final Product product;
        private Boolean isPublic;
        private String previewImageUrl;

        public CustomDesignBuilder(String name, User creator, Product product) {
            this.name = name;
            this.creator = creator;
            this.product = product;
        }

        public CustomDesignBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public CustomDesignBuilder withPrice(BigDecimal price) {
            this.price = price;
            return this;
        }

        public CustomDesignBuilder isPublic(boolean isPublic) {
            this.isPublic = isPublic;
            return this;
        }

        public CustomDesignBuilder withPreviewImageUrl(String url) {
            this.previewImageUrl = url;
            return this;
        }

        public CustomDesign build() {
            return new CustomDesign(this);
        }
    }
}