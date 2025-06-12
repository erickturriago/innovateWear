package com.innovatewear.service;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
import com.innovatewear.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener solo usuarios activos
    public List<User> getActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    // Obtener usuario por ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Obtener usuario activo por ID
    public Optional<User> getActiveUserById(Long id) {
        return userRepository.findById(id)
                .filter(User::getActive);
    }

    // Buscar usuario por email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Crear nuevo usuario
    public User createUser(User user) {
        // Verificar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado: " + user.getEmail());
        }

        return userRepository.save(user);
    }

    // Actualizar usuario existente
    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            existingUser.setName(userDetails.getName());

            // Solo actualizar email si es diferente y no existe
            if (!existingUser.getEmail().equals(userDetails.getEmail())) {
                if (userRepository.existsByEmail(userDetails.getEmail())) {
                    throw new RuntimeException("El email ya está registrado: " + userDetails.getEmail());
                }
                existingUser.setEmail(userDetails.getEmail());
            }

            existingUser.setPassword(userDetails.getPassword());
            existingUser.setRole(userDetails.getRole());
            existingUser.setActive(userDetails.getActive());

            return userRepository.save(existingUser);
        }

        throw new RuntimeException("Usuario no encontrado con ID: " + id);
    }

    /**
     * Autentica a un usuario por su email y contraseña.
     * @param email El email del usuario.
     * @param password La contraseña en texto plano para ser comparada.
     * @return Un Optional con el User si la autenticación es exitosa, de lo contrario un Optional vacío.
     */
    public Optional<User> login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent() && userOptional.get().getPassword().equals(password)) {
            return userOptional;
        }

        return Optional.empty();
    }

    /**
     * Cambia el rol de un usuario existente.
     * @param userId El ID del usuario a modificar.
     * @param newRole El nuevo rol a asignar.
     * @return El usuario con el rol actualizado.
     */
    public User changeUserRole(Long userId, User.UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        user.setRole(newRole);
        return userRepository.save(user);
    }

    // Desactivar usuario (borrado lógico)
    public void deactivateUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setActive(false);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }

    // Eliminar usuario físicamente
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }

    // Buscar usuarios por rol
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRoleAndActiveTrue(role);
    }

    // Obtener todos los artistas
    public List<User> getArtists() {
        return userRepository.findByRoleAndActiveTrue(UserRole.ARTISTA);
    }

    // Obtener todos los clientes
    public List<User> getClients() {
        return userRepository.findByRoleAndActiveTrue(UserRole.CLIENTE);
    }

    // Buscar usuarios por nombre
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }

    // Verificar si existe usuario
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    // Verificar si existe email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}