package com.innovatewear.controller;

import com.innovatewear.entity.User;
import com.innovatewear.service.UserService;
import com.innovatewear.utils.JsonPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    private final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    public record LoginRequest(String email, String password) {}
    public record RoleUpdateRequest(String newRole) {}

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        LOGGER.info("Intento de login para el email: {}", loginRequest.email());
        Optional<User> userOptional = userService.login(loginRequest.email(), loginRequest.password());

        if (userOptional.isPresent()) {
            LOGGER.info("Login exitoso para el usuario: {}", userOptional.get().getEmail());
            return ResponseEntity.ok(userOptional.get());
        } else {
            LOGGER.warn("Login fallido para el email: {}", loginRequest.email());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        LOGGER.info("Request para obtener todos los usuarios activos");
        List<User> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        LOGGER.info("Request para obtener usuario con ID: {}", id);
        return userService.getActiveUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("Usuario con ID {} no encontrado.", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        LOGGER.info("Request para crear usuario: {}", JsonPrinter.toString(user));
        try {
            User createdUser = userService.createUser(user);
            LOGGER.info("Usuario creado con ID: {}", createdUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            LOGGER.error("Error al crear usuario: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        LOGGER.info("Request para actualizar usuario con ID {}: {}", id, JsonPrinter.toString(userDetails));
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar usuario con ID {}: " + e.getMessage(), id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}