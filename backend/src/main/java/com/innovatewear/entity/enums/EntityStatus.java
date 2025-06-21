// src/main/java/com/innovatewear/entity/enums/EntityStatus.java
package com.innovatewear.entity.enums;

public enum EntityStatus {
    ACTIVE,  // Visible para todos
    INACTIVE, // Oculto para clientes, visible para admin
    ARCHIVED // Oculto para todos, borrado lógicamente
}