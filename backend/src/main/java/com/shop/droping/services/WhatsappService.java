package com.shop.droping.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsappService.class);

    public void sendMessage(String to, String message) {
        // Simulation de l'envoi de message WhatsApp
        logger.info("--- DEBUT MESSAGE WHATSAPP SIMULÉ ---");
        logger.info("À: " + to);
        logger.info("Message: " + message);
        logger.info("--- FIN MESSAGE WHATSAPP SIMULÉ ---");
        // Dans une version de production, le code pour appeler l'API Meta/Twilio serait ici.
    }
}
