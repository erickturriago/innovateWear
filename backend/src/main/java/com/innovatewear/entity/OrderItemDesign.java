package com.innovatewear.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_item_designs")
public class OrderItemDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_item_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "designs"})
    private OrderItem orderItem;

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

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructor vacío
    public OrderItemDesign() {}

    // Constructor con parámetros principales
    public OrderItemDesign(OrderItem orderItem, Design design) {
        this.orderItem = orderItem;
        this.design = design;
    }

    // Constructor con posición y tamaño
    public OrderItemDesign(OrderItem orderItem, Design design, Integer positionX, Integer positionY, Integer sizePercentage) {
        this.orderItem = orderItem;
        this.design = design;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizePercentage = sizePercentage;
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

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}