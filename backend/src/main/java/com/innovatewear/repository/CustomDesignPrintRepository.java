package com.innovatewear.repository;

import com.innovatewear.entity.CustomDesignPrint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomDesignPrintRepository extends JpaRepository<CustomDesignPrint, Long> {
}