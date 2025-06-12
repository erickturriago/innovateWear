package com.innovatewear.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_design_prints")
public class CustomDesignPrint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "custom_design_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "prints"})
    private CustomDesign customDesign;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "design_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Design design;

    @Column(name = "position_x")
    private Integer positionX;

    @Column(name = "position_y")
    private Integer positionY;

    @Column(name = "size_percentage")
    private Integer sizePercentage;

    @Column(name = "rotation_angle")
    private Integer rotationAngle;

    @Column(name = "layer_order")
    private Integer layerOrder; // Para múltiples diseños superpuestos

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructor vacío
    public CustomDesignPrint() {}

    // Constructor con parámetros principales
    public CustomDesignPrint(CustomDesign customDesign, Design design) {
        this.customDesign = customDesign;
        this.design = design;
    }

    // Constructor completo
    public CustomDesignPrint(CustomDesign customDesign, Design design, Integer positionX,
                             Integer positionY, Integer sizePercentage, Integer rotationAngle, Integer layerOrder) {
        this.customDesign = customDesign;
        this.design = design;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizePercentage = sizePercentage;
        this.rotationAngle = rotationAngle;
        this.layerOrder = layerOrder;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CustomDesign getCustomDesign() {
        return customDesign;
    }

    public void setCustomDesign(CustomDesign customDesign) {
        this.customDesign = customDesign;
    }

    public Design getDesign() {
        return design;
    }

    public void setDesign(Design design) {
        this.design = design;
    }

    public Integer getPositionX() {
        return positionX;
    }

    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }

    public Integer getPositionY() {
        return positionY;
    }

    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }

    public Integer getSizePercentage() {
        return sizePercentage;
    }

    public void setSizePercentage(Integer sizePercentage) {
        this.sizePercentage = sizePercentage;
    }

    public Integer getRotationAngle() {
        return rotationAngle;
    }

    public void setRotationAngle(Integer rotationAngle) {
        this.rotationAngle = rotationAngle;
    }

    public Integer getLayerOrder() {
        return layerOrder;
    }

    public void setLayerOrder(Integer layerOrder) {
        this.layerOrder = layerOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}