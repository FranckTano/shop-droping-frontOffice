package com.shop.droping.facade;

import com.shop.droping.domain.Commande;
import com.shop.droping.enums.StatutPaiement;
import com.shop.droping.presentation.dto.CommandeDto;
import com.shop.droping.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CinetPayService {

    private static final String CINETPAY_INIT_URL = "https://api-checkout.cinetpay.com/v2/payment";
    private static final String CINETPAY_VERIFY_URL = "https://api-checkout.cinetpay.com/v2/payment/check";

    @Value("${cinetpay.api-key}")
    private String apiKey;

    @Value("${cinetpay.site-id}")
    private String siteId;

    @Value("${cinetpay.notify-url}")
    private String notifyUrl;

    @Value("${cinetpay.return-url}")
    private String returnUrl;

    private final CommandeRepository commandeRepository;
    private final RestTemplate restTemplate;

    public CinetPayService(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
        this.restTemplate = new RestTemplate();
    }

    @Transactional
    public Map<String, Object> initierPaiement(Long commandeId) {
        Commande commande = commandeRepository.findByIdWithLignes(commandeId)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée: " + commandeId));

        String transactionId = "TXN-" + commande.getNumero();

        Map<String, Object> body = new HashMap<>();
        body.put("apikey", apiKey);
        body.put("site_id", siteId);
        body.put("transaction_id", transactionId);
        body.put("amount", commande.getMontantTotal().intValue());
        body.put("currency", "XOF");
        body.put("description", "Commande " + commande.getNumero() + " — MOMO Shop");
        body.put("notify_url", notifyUrl);
        body.put("return_url", returnUrl + "?transactionId=" + transactionId + "&commandeId=" + commandeId);
        body.put("customer_name", commande.getClientNom());
        body.put("customer_phone_number", commande.getClientTelephone());
        if (commande.getClientEmail() != null && !commande.getClientEmail().isBlank()) {
            body.put("customer_email", commande.getClientEmail());
        }
        body.put("customer_address", commande.getClientAdresse() != null ? commande.getClientAdresse() : "Abidjan");
        body.put("customer_city", "Abidjan");
        body.put("customer_country", "CI");
        body.put("customer_state", "CI");
        body.put("customer_zip_code", "00225");
        body.put("channels", "ALL");
        body.put("metadata", commandeId.toString());
        body.put("lang", "fr");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(CINETPAY_INIT_URL, request, Map.class);
        Map<String, Object> result = response.getBody();

        if (result != null && "201".equals(String.valueOf(result.get("code")))) {
            commande.setTransactionId(transactionId);
            commande.setStatutPaiement(StatutPaiement.EN_ATTENTE_PAIEMENT);
            commandeRepository.save(commande);
        }

        return result != null ? result : Map.of("code", "500", "message", "Erreur CinetPay");
    }

    @Transactional
    public void traiterWebhook(String transactionId, String token) {
        // Vérification du statut auprès de CinetPay
        Map<String, Object> body = new HashMap<>();
        body.put("apikey", apiKey);
        body.put("site_id", siteId);
        body.put("transaction_id", transactionId);
        body.put("token", token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(CINETPAY_VERIFY_URL, request, Map.class);
            Map<String, Object> result = response.getBody();

            if (result != null) {
                String code = String.valueOf(result.get("code"));
                commandeRepository.findByTransactionId(transactionId).ifPresent(commande -> {
                    if ("00".equals(code)) {
                        commande.setStatutPaiement(StatutPaiement.PAYE);
                    } else {
                        commande.setStatutPaiement(StatutPaiement.ECHEC);
                    }
                    commandeRepository.save(commande);
                });
            }
        } catch (Exception e) {
            // Log l'erreur mais ne pas bloquer le webhook
        }
    }

    @Transactional(readOnly = true)
    public CommandeDto verifierStatutPaiement(String transactionId) {
        Commande commande = commandeRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction introuvable: " + transactionId));
        return CommandeDto.fromEntity(commande);
    }
}
