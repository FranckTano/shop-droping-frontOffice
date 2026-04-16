package com.shop.droping.presentation.dto;

import com.shop.droping.domain.Configuration;

public record ConfigurationDto(
    Long id,
    String cle,
    String valeur,
    String description
) {
    public static ConfigurationDto fromEntity(Configuration config) {
        return new ConfigurationDto(
            config.getId(),
            config.getCle(),
            config.getValeur(),
            config.getDescription()
        );
    }
}

