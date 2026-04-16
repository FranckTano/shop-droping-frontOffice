package com.shop.droping.facade;

import com.shop.droping.domain.Configuration;
import com.shop.droping.presentation.dto.ConfigurationDto;
import com.shop.droping.repository.ConfigurationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ConfigurationFacade {

    private final ConfigurationRepository configurationRepository;

    public ConfigurationFacade(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    public List<ConfigurationDto> listerToutesLesConfigurations() {
        return configurationRepository.findAll()
            .stream()
            .map(ConfigurationDto::fromEntity)
            .toList();
    }

    public Map<String, String> listerConfigurationsMap() {
        return configurationRepository.findAll()
            .stream()
            .collect(Collectors.toMap(Configuration::getCle, Configuration::getValeur));
    }

    public String lireValeur(String cle) {
        return configurationRepository.findByCle(cle)
            .map(Configuration::getValeur)
            .orElse(null);
    }

    public String lireValeur(String cle, String valeurParDefaut) {
        return configurationRepository.findByCle(cle)
            .map(Configuration::getValeur)
            .orElse(valeurParDefaut);
    }

    public ConfigurationDto trouverParCle(String cle) {
        return configurationRepository.findByCle(cle)
            .map(ConfigurationDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée pour la clé: " + cle));
    }

    @Transactional
    public ConfigurationDto mettreAJour(String cle, String valeur) {
        Configuration config = configurationRepository.findByCle(cle)
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée pour la clé: " + cle));

        config.setValeur(valeur);
        return ConfigurationDto.fromEntity(configurationRepository.save(config));
    }

    @Transactional
    public ConfigurationDto creerOuMettreAJour(String cle, String valeur, String description) {
        Configuration config = configurationRepository.findByCle(cle)
            .orElseGet(() -> new Configuration(cle, valeur, description));

        config.setValeur(valeur);
        if (description != null) {
            config.setDescription(description);
        }

        return ConfigurationDto.fromEntity(configurationRepository.save(config));
    }
}

