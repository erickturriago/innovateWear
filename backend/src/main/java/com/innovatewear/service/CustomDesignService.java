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
    private CustomDesignPrintRepository customDesignPrintRepository; // Inyección necesaria

    public CustomDesign createCustomDesign(CustomDesign designFromRequest) {
        User creator = userRepository.findById(designFromRequest.getCreator().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario creador no encontrado con ID: " + designFromRequest.getCreator().getId()));

        Product product = productRepository.findById(designFromRequest.getProduct().getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + designFromRequest.getProduct().getId()));

        CustomDesign newDesign = new CustomDesign();
        newDesign.setCreator(creator);
        newDesign.setProduct(product);
        newDesign.setName(designFromRequest.getName());
        newDesign.setDescription(designFromRequest.getDescription());
        newDesign.setPrice(designFromRequest.getPrice());
        newDesign.setIsPublic(designFromRequest.getIsPublic());

        CustomDesign savedDesign = customDesignRepository.save(newDesign);

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

    public CustomDesign updateCustomDesign(Long id, CustomDesign designDetails) {
        CustomDesign existingDesign = customDesignRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diseño personalizado no encontrado con ID: " + id));

        existingDesign.setName(designDetails.getName());
        existingDesign.setDescription(designDetails.getDescription());
        existingDesign.setPrice(designDetails.getPrice());
        existingDesign.setIsPublic(designDetails.getIsPublic());

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

    public List<CustomDesign> getCustomDesignsByCreator(Long creatorId) {
        return customDesignRepository.findByCreatorIdAndActiveTrue(creatorId);
    }

    public Optional<CustomDesign> getActiveCustomDesignById(Long id) {
        return customDesignRepository.findByIdAndActiveTrue(id);
    }
}