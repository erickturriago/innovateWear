package com.innovatewear.service.strategy;

import com.innovatewear.entity.Design;
import java.util.List;
import java.util.stream.Collectors;

public class NameSearchStrategy implements DesignSearchStrategy {

    @Override
    public List<Design> filter(List<Design> designs, String criteria) {
        if (criteria == null || criteria.trim().isEmpty()) {
            return designs;
        }

        String searchTerm = criteria.toLowerCase();
        return designs.stream()
                .filter(design -> design.getName().toLowerCase().contains(searchTerm))
                .collect(Collectors.toList());
    }

    @Override
    public boolean canHandle(String criteria) {
        return criteria != null && !criteria.trim().isEmpty();
    }
}