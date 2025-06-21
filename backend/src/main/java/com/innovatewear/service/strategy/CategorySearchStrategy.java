package com.innovatewear.service.strategy;

import com.innovatewear.entity.Design;
import java.util.List;
import java.util.stream.Collectors;

public class CategorySearchStrategy implements DesignSearchStrategy {

    private final Long categoryId;

    public CategorySearchStrategy(Long categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public List<Design> filter(List<Design> designs, String criteria) {
        return designs.stream()
                .filter(design -> design.getCategory() != null &&
                        design.getCategory().getId().equals(categoryId))
                .collect(Collectors.toList());
    }

    @Override
    public boolean canHandle(String criteria) {
        return categoryId != null;
    }
}