package com.shop.droping.configuration;

import com.shop.droping.domain.Configuration;
import com.shop.droping.domain.Utilisateur;
import com.shop.droping.enums.Role;
import com.shop.droping.enums.StatutUtilisateur;
import com.shop.droping.repository.ConfigurationRepository;
import com.shop.droping.repository.UtilisateurRepository;
import com.shop.droping.services.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Initialise les données essentielles au premier démarrage :
 * - Compte SUPER_ADMIN par défaut
 * - Configuration WhatsApp et boutique par défaut
 */
@Component
@Order(1)
public class DataInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UtilisateurRepository utilisateurRepository;
    private final ConfigurationRepository configurationRepository;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           ConfigurationRepository configurationRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.configurationRepository = configurationRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        creerSuperAdminSiAbsent();
        creerConfigurationsParDefautSiAbsentes();
    }

    private void creerSuperAdminSiAbsent() {
        boolean superAdminExiste = utilisateurRepository.findAll()
                .stream()
                .anyMatch(u -> Role.SUPER_ADMIN.equals(u.getRole()));

        if (!superAdminExiste) {
            Utilisateur superAdmin = new Utilisateur(
                    "superadmin",
                    SecurityService.crypterPassword("Admin@2026!"),
                    "Super",
                    "Admin",
                    Role.SUPER_ADMIN,
                    StatutUtilisateur.ACTIF
            );
            utilisateurRepository.save(superAdmin);
            logger.info("SUPER_ADMIN créé — login: superadmin / password: Admin@2026!");
            logger.warn("IMPORTANT: Changez le mot de passe SUPER_ADMIN après la première connexion !");
        }
    }

    private void creerConfigurationsParDefautSiAbsentes() {
        creerConfigSiAbsente(Configuration.CLE_NOM_BOUTIQUE, "Shop Droping",
                "Nom de la boutique affiché dans les messages WhatsApp");
        creerConfigSiAbsente(Configuration.CLE_WHATSAPP_NUMERO, "+2250799136306",
                "Numéro WhatsApp Business de la boutique");
        creerConfigSiAbsente(Configuration.CLE_DEVISE, "FCFA",
                "Devise utilisée pour les prix");
    }

    private void creerConfigSiAbsente(String cle, String valeurDefaut, String description) {
        if (configurationRepository.findByCle(cle).isEmpty()) {
            Configuration config = new Configuration();
            config.setCle(cle);
            config.setValeur(valeurDefaut);
            config.setDescription(description);
            configurationRepository.save(config);
            logger.info("Configuration créée: {} = {}", cle, valeurDefaut);
        }
    }
}
