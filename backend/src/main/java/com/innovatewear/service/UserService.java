package com.innovatewear.service;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
import com.innovatewear.repository.UserRepository;
import com.innovatewear.service.template.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService extends BaseEntityService<User, Long> {

    @Autowired
    private UserRepository userRepository;

    // =====================================================
    // IMPLEMENTACIÓN DE MÉTODOS ABSTRACTOS DEL TEMPLATE
    // =====================================================

    @Override
    protected JpaRepository<User, Long> getRepository() {
        return userRepository;
    }

    @Override
    protected String getEntityName() {
        return "Usuario";
    }

    @Override
    protected void validateBeforeCreate(User user) {
        // Verificar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado: " + user.getEmail());
        }
    }

    @Override
    protected void validateBeforeUpdate(Long id, User userDetails) {
        // Solo validar email si es diferente al actual
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent() && !existingUser.get().getEmail().equals(userDetails.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("El email ya está registrado: " + userDetails.getEmail());
            }
        }
    }

    @Override
    protected void updateEntityFields(User existing, User details) {
        existing.setName(details.getName());

        // Solo actualizar email si es diferente y no existe
        if (!existing.getEmail().equals(details.getEmail())) {
            if (userRepository.existsByEmail(details.getEmail())) {
                throw new RuntimeException("El email ya está registrado: " + details.getEmail());
            }
            existing.setEmail(details.getEmail());
        }

        existing.setPassword(details.getPassword());
        existing.setRole(details.getRole());
        existing.setActive(details.getActive());
    }

    @Override
    protected void setEntityInactive(User user) {
        user.setActive(false);
    }

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return getAllEntities(); // Usa metodo del template
    }

    // Obtener solo usuarios activos
    public List<User> getActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    // Obtener usuario por ID
    public Optional<User> getUserById(Long id) {
        return getEntityById(id); // Usa metodo del template
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
        return createEntity(user); // Usa template method
    }

    // Actualizar usuario existente
    public User updateUser(Long id, User userDetails) {
        return updateEntity(id, userDetails); // Usa template method
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
        deactivateEntity(id);
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

    // Verificar si existe usuario - REFACTORIZADO
    public boolean existsById(Long id) {
        return existsById(id); // Usa metodo del template
    }

    // Verificar si existe email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}