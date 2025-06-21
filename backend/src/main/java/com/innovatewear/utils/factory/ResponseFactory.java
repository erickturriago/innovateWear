package com.innovatewear.utils.factory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Factory para crear respuestas HTTP estandarizadas.
 * Centraliza la creación de ResponseEntity con códigos de estado apropiados.
 */
public class ResponseFactory {

    /**
     * Respuesta exitosa con datos (200 OK)
     */
    public static <T> ResponseEntity<T> success(T data) {
        return ResponseEntity.ok(data);
    }

    /**
     * Respuesta de creación exitosa (201 CREATED)
     */
    public static <T> ResponseEntity<T> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(data);
    }

    /**
     * Respuesta sin contenido (204 NO CONTENT)
     */
    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    /**
     * Respuesta de no encontrado (404 NOT FOUND)
     */
    public static <T> ResponseEntity<T> notFound() {
        return ResponseEntity.notFound().build();
    }

    /**
     * Respuesta de solicitud incorrecta (400 BAD REQUEST)
     */
    public static <T> ResponseEntity<T> badRequest() {
        return ResponseEntity.badRequest().build();
    }

    /**
     * Respuesta de no autorizado (401 UNAUTHORIZED)
     */
    public static <T> ResponseEntity<T> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /**
     * Respuesta de error interno del servidor (500 INTERNAL SERVER ERROR)
     */
    public static <T> ResponseEntity<T> internalServerError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}