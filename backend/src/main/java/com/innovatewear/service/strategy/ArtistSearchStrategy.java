package com.innovatewear.service.strategy;

import com.innovatewear.entity.Design;
import java.util.List;
import java.util.stream.Collectors;

public class ArtistSearchStrategy implements DesignSearchStrategy {

    private final Long artistId;

    public ArtistSearchStrategy(Long artistId) {
        this.artistId = artistId;
    }

    @Override
    public List<Design> filter(List<Design> designs, String criteria) {
        return designs.stream()
                .filter(design -> design.getArtist() != null &&
                        design.getArtist().getId().equals(artistId))
                .collect(Collectors.toList());
    }

    @Override
    public boolean canHandle(String criteria) {
        return artistId != null;
    }
}