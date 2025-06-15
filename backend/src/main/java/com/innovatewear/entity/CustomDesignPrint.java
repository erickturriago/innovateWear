package com.innovatewear.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_design_prints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomDesignPrint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_design_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "prints"})
    private CustomDesign customDesign;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "design_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Design design;

    private Integer positionX;
    private Integer positionY;
    private Integer sizePercentage;
    private Integer rotationAngle;
    private Integer layerOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}