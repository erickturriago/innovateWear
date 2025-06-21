package com.innovatewear.service;

import com.innovatewear.entity.*;
import com.innovatewear.repository.CustomDesignPrintRepository;
import com.innovatewear.repository.CustomDesignRepository;
import com.innovatewear.repository.DesignRepository;
import com.innovatewear.repository.ProductRepository;
import com.innovatewear.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomDesignService {

    @Autowired
    private CustomDesignRepository customDesignRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private DesignRepository designRepository;
    @Autowired
    private CustomDesignPrintRepository customDesignPrintRepository;

    public CustomDesign createCustomDesign(CustomDesign designFromRequest) {
        // 1. Validaciones previas
        User creator = userRepository.findById(designFromRequest.getCreator().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario creador no encontrado con ID: " + designFromRequest.getCreator().getId()));

        Product product = productRepository.findById(designFromRequest.getProduct().getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + designFromRequest.getProduct().getId()));

        // 2. Usar el Builder para crear el objeto CustomDesign
        CustomDesign newDesign = new CustomDesign.CustomDesignBuilder(designFromRequest.getName(), creator, product)
                .withDescription(designFromRequest.getDescription())
                .withPrice(designFromRequest.getPrice())
                .isPublic(designFromRequest.getIsPublic())
                .withPreviewImageUrl(designFromRequest.getPreviewImageUrl())
                .build();

        // 3. Guardar el objeto base
        CustomDesign savedDesign = customDesignRepository.save(newDesign);

        // 4. Lógica para asociar las estampas (sin cambios)
        if (designFromRequest.getPrints() != null && !designFromRequest.getPrints().isEmpty()) {
            List<CustomDesignPrint> persistentPrints = designFromRequest.getPrints().stream().map(printRequest -> {
                Design stamp = designRepository.findById(printRequest.getDesign().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Estampa no encontrada con ID: " + printRequest.getDesign().getId()));

                CustomDesignPrint newPrint = new CustomDesignPrint();
                newPrint.setCustomDesign(savedDesign);
                newPrint.setDesign(stamp);
                return customDesignPrintRepository.save(newPrint);
            }).collect(Collectors.toList());
            savedDesign.setPrints(persistentPrints);
        }

        return savedDesign;
    }

    // Se modifica para que la comprobación de propiedad se haga en el controller
    public CustomDesign updateCustomDesign(Long id, CustomDesign designDetails) {
        CustomDesign existingDesign = customDesignRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diseño personalizado no encontrado con ID: " + id));

        // Lógica de actualización parcial para solo cambiar los campos que llegan
        if (designDetails.getName() != null) {
            existingDesign.setName(designDetails.getName());
        }
        if (designDetails.getDescription() != null) {
            existingDesign.setDescription(designDetails.getDescription());
        }
        if (designDetails.getPrice() != null) {
            existingDesign.setPrice(designDetails.getPrice());
        }
        if (designDetails.getIsPublic() != null) {
            existingDesign.setIsPublic(designDetails.getIsPublic());
        }
        if (designDetails.getActive() != null) {
            existingDesign.setActive(designDetails.getActive());
        }

        return customDesignRepository.save(existingDesign);
    }

    public void deactivateCustomDesign(Long designId, Long artistId) {
        CustomDesign design = customDesignRepository.findById(designId)
                .orElseThrow(() -> new EntityNotFoundException("Diseño no encontrado con ID: " + designId));

        if (!design.getCreator().getId().equals(artistId)) {
            throw new SecurityException("No tienes permiso para eliminar este diseño.");
        }

        design.setActive(false);
        customDesignRepository.save(design);
    }

    public List<CustomDesign> getPublicCustomDesigns() {
        return customDesignRepository.findByIsPublicTrueAndActiveTrue();
    }

    public CustomDesign togglePublicStatus(Long designId) {
        CustomDesign design = customDesignRepository.findById(designId)
                .orElseThrow(() -> new EntityNotFoundException("Diseño no encontrado con ID: " + designId));
        design.setIsPublic(!design.getIsPublic());
        return customDesignRepository.save(design);
    }

    // Se modifica para usar el nuevo método del repositorio
    public List<CustomDesign> getCustomDesignsByCreator(Long creatorId) {
        // Ahora devuelve TODOS los diseños del creador, activos o inactivos.
        return customDesignRepository.findByCreatorId(creatorId);
    }

    public List<CustomDesign> getAllCustomDesigns() {
        return customDesignRepository.findAll().stream()
                .filter(customDesign -> customDesign.getIsArchived() != null && !customDesign.getIsArchived())
                .collect(Collectors.toList());
    }

    public CustomDesign toggleActivation(Long designId) {
        CustomDesign design = customDesignRepository.findById(designId)
                .orElseThrow(() -> new EntityNotFoundException("Diseño no encontrado con ID: " + designId));
        design.setActive(!design.getActive());
        return customDesignRepository.save(design);
    }

    public Optional<CustomDesign> getActiveCustomDesignById(Long id) {
        return customDesignRepository.findByIdAndActiveTrue(id);
    }

    public void archiveCustomDesign(Long id) {
        CustomDesign design = customDesignRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diseño no encontrado con ID: " + id));
        design.setIsArchived(true);
        design.setActive(false);
        customDesignRepository.save(design);
    }
}