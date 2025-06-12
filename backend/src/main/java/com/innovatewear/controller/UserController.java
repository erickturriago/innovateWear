package com.innovatewear.controller;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
import com.innovatewear.service.UserService;
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

    // DTO para la solicitud de login
    public record LoginRequest(String email, String password) {}

    // DTO para la solicitud de cambio de rol
    public record RoleUpdateRequest(String newRole) {}

    // POST /api/users/login - Autenticar usuario
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.login(loginRequest.email(), loginRequest.password());

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // GET /api/users - Obtener todos los usuarios activos
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }

    // GET /api/users/all - Obtener todos los usuarios (incluyendo inactivos)
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsersIncludingInactive() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // GET /api/users/{id} - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getActiveUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/users/email/{email} - Buscar usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);

        if (user.isPresent() && user.get().getActive()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/users - Crear nuevo usuario
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // PUT /api/users/{id} - Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // PUT /api/users/{id}/role - Actualizar solo el rol del usuario
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest roleUpdate) {
        User.UserRole newRole;
        try {
            // Convierte el texto del rol a nuestro tipo Enum, asegurando que sea válido
            newRole = User.UserRole.valueOf(roleUpdate.newRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // El rol enviado no existe
        }

        try {
            User updatedUser = userService.changeUserRole(id, newRole);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // El usuario con ese ID no existe
        }
    }

    // DELETE /api/users/{id} - Desactivar usuario (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/users/{id}/permanent - Eliminar usuario permanentemente
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteUserPermanently(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/users/role/{role} - Buscar usuarios por rol
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/users/artists - Obtener todos los artistas
    @GetMapping("/artists")
    public ResponseEntity<List<User>> getArtists() {
        List<User> artists = userService.getArtists();
        return ResponseEntity.ok(artists);
    }

    // GET /api/users/clients - Obtener todos los clientes
    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClients() {
        List<User> clients = userService.getClients();
        return ResponseEntity.ok(clients);
    }

    // GET /api/users/search?name=nombreUsuario - Buscar por nombre
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
}