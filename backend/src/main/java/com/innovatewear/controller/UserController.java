package com.innovatewear.controller;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
import com.innovatewear.service.UserService;
import com.innovatewear.utils.JsonPrinter;
import com.innovatewear.utils.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
            return ResponseFactory.success(userOptional.get());
        } else {
            LOGGER.warn("Login fallido para el email: {}", loginRequest.email());
            return ResponseFactory.unauthorized();
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        LOGGER.info("Request para obtener todos los usuarios activos");
        List<User> users = userService.getActiveUsers();
        return ResponseFactory.success(users);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsersIncludingInactive() {
        LOGGER.info("Request para obtener todos los usuarios (incluyendo inactivos)");
        List<User> users = userService.getAllUsers();
        return ResponseFactory.success(users);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        LOGGER.info("Request para obtener usuario con ID: {}", id);
        return userService.getActiveUserById(id)
                .map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Usuario con ID {} no encontrado.", id);
                    return ResponseFactory.notFound();
                });
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        LOGGER.info("Request para obtener usuario con email: {}", email);
        Optional<User> user = userService.getUserByEmail(email);

        return user.map(ResponseFactory::success)
                .orElseGet(() -> {
                    LOGGER.warn("Usuario con email {} no encontrado.", email);
                    return ResponseFactory.notFound();
                });
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        LOGGER.info("Request para crear usuario: {}", JsonPrinter.toString(user));
        try {
            User createdUser = userService.createUser(user);
            LOGGER.info("Usuario creado con ID: {}", createdUser.getId());
            return ResponseFactory.created(createdUser);
        } catch (Exception e) {
            LOGGER.error("Error al crear usuario: {}", e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        LOGGER.info("Request para actualizar usuario con ID {}: {}", id, JsonPrinter.toString(userDetails));
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseFactory.success(updatedUser);
        } catch (Exception e) {
            LOGGER.error("Error al actualizar usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.badRequest();
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest roleUpdate) {
        LOGGER.info("Request para actualizar rol del usuario con ID {} al rol {}", id, roleUpdate.newRole());
        try {
            UserRole newRole = UserRole.valueOf(roleUpdate.newRole().toUpperCase());
            User updatedUser = userService.changeUserRole(id, newRole);
            return ResponseFactory.success(updatedUser);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Rol inválido '{}' proporcionado para el usuario con ID {}", roleUpdate.newRole(), id);
            return ResponseFactory.badRequest();
        } catch (Exception e) {
            LOGGER.error("Error al actualizar rol para usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        LOGGER.info("Request para desactivar usuario con ID: {}", id);
        try {
            userService.deactivateUser(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            LOGGER.error("Error al desactivar usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteUserPermanently(@PathVariable Long id) {
        LOGGER.info("Request para eliminar permanentemente al usuario con ID: {}", id);
        try {
            userService.deleteUser(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            LOGGER.error("Error al eliminar permanentemente al usuario con ID {}: {}", id, e.getMessage(), e);
            return ResponseFactory.notFound();
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        LOGGER.info("Request para obtener usuarios con el rol: {}", role);
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseFactory.success(users);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Se solicitó un rol inválido: {}", role);
            return ResponseFactory.badRequest();
        }
    }

    @GetMapping("/artists")
    public ResponseEntity<List<User>> getArtists() {
        LOGGER.info("Request para obtener todos los usuarios con rol ARTISTA");
        List<User> artists = userService.getArtists();
        return ResponseFactory.success(artists);
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClients() {
        LOGGER.info("Request para obtener todos los usuarios con rol CLIENTE");
        List<User> clients = userService.getClients();
        return ResponseFactory.success(clients);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        LOGGER.info("Request para buscar usuarios por nombre que contenga: {}", name);
        List<User> users = userService.searchUsersByName(name);
        return ResponseFactory.success(users);
    }

    @DeleteMapping("/{id}/archive")
    public ResponseEntity<Void> archiveProduct(@PathVariable Long id) {
        try {
            userService.archiveUser(id);
            return ResponseFactory.noContent();
        } catch (Exception e) {
            return ResponseFactory.notFound();
        }
    }
}