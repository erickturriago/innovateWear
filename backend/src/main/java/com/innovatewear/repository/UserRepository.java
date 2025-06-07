package com.innovatewear.repository;

import com.innovatewear.entity.User;
import com.innovatewear.entity.User.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Buscar por email (para login)
    Optional<User> findByEmail(String email);
    
    // Verificar si existe email
    boolean existsByEmail(String email);
    
    // Buscar usuarios activos
    List<User> findByActiveTrue();
    
    // Buscar por rol
    List<User> findByRole(UserRole role);
    
    // Buscar usuarios activos por rol
    List<User> findByRoleAndActiveTrue(UserRole role);
    
    // Buscar por nombre (contiene texto)
    List<User> findByNameContainingIgnoreCase(String name);
    
    // Buscar usuarios activos por nombre
    List<User> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    
    // Verificar si existe usuario activo por ID
    boolean existsByIdAndActiveTrue(Long id);
}