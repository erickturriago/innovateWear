package com.innovatewear.service.chain;

import com.innovatewear.entity.Order;
import com.innovatewear.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

public class UserValidationHandler extends OrderValidationHandler {

    private final UserRepository userRepository;

    public UserValidationHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void handle(Order order) {

        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new IllegalArgumentException("La orden debe tener un usuario asociado.");
        }

        userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + order.getUser().getId()));


        // Si la validación es exitosa, pasa al siguiente manejador
        handleNext(order);
    }
}