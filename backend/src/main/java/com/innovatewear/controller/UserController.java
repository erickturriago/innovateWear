package com.innovatewear.controller;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
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

    // Logger manual como solicitaste
    private final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    // DTOs locales definidos como records
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

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsersIncludingInactive() {
        LOGGER.info("Request para obtener todos los usuarios (incluyendo inactivos)");
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // RUTA CORREGIDA: Se cambia de "/{id}" a "/detail/{id}" para evitar ambigüedad
    @GetMapping("/detail/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        LOGGER.info("Request para obtener usuario con ID: {}", id);
        return userService.getActiveUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("Usuario con ID {} no encontrado.", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        LOGGER.info("Request para obtener usuario con email: {}", email);
        Optional<User> user = userService.getUserByEmail(email);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> {
                    LOGGER.warn("Usuario con email {} no encontrado.", email);
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
            LOGGER.error("Error al crear usuario: {}", e.getMessage(), e);
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
            LOGGER.error("Error al actualizar usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest roleUpdate) {
        LOGGER.info("Request para actualizar rol del usuario con ID {} al rol {}", id, roleUpdate.newRole());
        try {
            UserRole newRole = UserRole.valueOf(roleUpdate.newRole().toUpperCase());
            User updatedUser = userService.changeUserRole(id, newRole);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Rol inválido '{}' proporcionado para el usuario con ID {}", roleUpdate.newRole(), id);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            LOGGER.error("Error al actualizar rol para usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        LOGGER.info("Request para desactivar usuario con ID: {}", id);
        try {
            userService.deactivateUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteUserPermanently(@PathVariable Long id) {
        LOGGER.info("Request para eliminar permanentemente al usuario con ID: {}", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("Error al eliminar permanentemente al usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        LOGGER.info("Request para obtener usuarios con el rol: {}", role);
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Se solicitó un rol inválido: {}", role);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/artists")
    public ResponseEntity<List<User>> getArtists() {
        LOGGER.info("Request para obtener todos los usuarios con rol ARTISTA");
        List<User> artists = userService.getArtists();
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClients() {
        LOGGER.info("Request para obtener todos los usuarios con rol CLIENTE");
        List<User> clients = userService.getClients();
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        LOGGER.info("Request para buscar usuarios por nombre que contenga: {}", name);
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
}