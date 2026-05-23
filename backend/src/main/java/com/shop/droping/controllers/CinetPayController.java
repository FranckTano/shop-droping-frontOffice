package com.shop.droping.controllers;

import com.shop.droping.facade.CinetPayService;
import com.shop.droping.presentation.dto.CommandeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/paiement")
public class CinetPayController {

    private final CinetPayService cinetPayService;

    public CinetPayController(CinetPayService cinetPayService) {
        this.cinetPayService = cinetPayService;
    }

    // Initier un paiement CinetPay pour une commande
    @PostMapping("/initier/{commandeId}")
    public ResponseEntity<Map<String, Object>> initierPaiement(@PathVariable Long commandeId) {
        Map<String, Object> result = cinetPayService.initierPaiement(commandeId);
        return ResponseEntity.ok(result);
    }

    // Webhook CinetPay — appelé par CinetPay après paiement
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestParam(required = false) String cpm_trans_id,
            @RequestParam(required = false) String cpm_payment_token,
            @RequestBody(required = false) Map<String, String> body) {

        String transactionId = cpm_trans_id;
        String token = cpm_payment_token;

        if (body != null) {
            if (transactionId == null) transactionId = body.get("cpm_trans_id");
            if (token == null) token = body.get("cpm_payment_token");
        }

        if (transactionId != null && token != null) {
            cinetPayService.traiterWebhook(transactionId, token);
        }

        return ResponseEntity.ok().build();
    }

    // Vérifier le statut d'un paiement
    @GetMapping("/statut/{transactionId}")
    public ResponseEntity<CommandeDto> statutPaiement(@PathVariable String transactionId) {
        CommandeDto dto = cinetPayService.verifierStatutPaiement(transactionId);
        return ResponseEntity.ok(dto);
    }
}
