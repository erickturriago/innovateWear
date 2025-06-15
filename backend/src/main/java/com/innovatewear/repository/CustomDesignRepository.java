package com.innovatewear.repository;

import com.innovatewear.entity.CustomDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomDesignRepository extends JpaRepository<CustomDesign, Long> {

    List<CustomDesign> findByIsPublicTrueAndActiveTrue();

    List<CustomDesign> findByCreatorIdAndActiveTrue(Long creatorId);

    Optional<CustomDesign> findByIdAndActiveTrue(Long id);
}