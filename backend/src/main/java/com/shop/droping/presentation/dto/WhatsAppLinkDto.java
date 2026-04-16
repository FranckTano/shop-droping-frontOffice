package com.shop.droping.presentation.dto;

/**
 * DTO pour générer un lien WhatsApp
 */
public record WhatsAppLinkDto(
    String numero,
    String message,
    String lienWhatsApp
) {
    public static WhatsAppLinkDto creer(String numero, String message) {
        String encodedMessage = java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8);
        String lien = "https://wa.me/" + numero.replace("+", "").replace(" ", "") + "?text=" + encodedMessage;
        return new WhatsAppLinkDto(numero, message, lien);
    }
}

