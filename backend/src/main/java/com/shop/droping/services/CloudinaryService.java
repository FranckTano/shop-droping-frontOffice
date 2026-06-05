package com.shop.droping.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.Set;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private static final Set<String> TYPES_AUTORISES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long TAILLE_MAX = 10L * 1024 * 1024;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Value("${cloudinary.folder:shop-dropping/frontoffice/produits}")
    private String folder;

    private final RestTemplate restTemplate = new RestTemplate();

    public String upload(MultipartFile file) {
        valider(file);
        try {
            byte[] bytes = file.getBytes();
            long timestamp = System.currentTimeMillis() / 1000;
            String signature = signer(timestamp);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(bytes) {
                @Override public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
                }
            });
            body.add("api_key",   apiKey);
            body.add("timestamp", String.valueOf(timestamp));
            body.add("signature", signature);
            body.add("folder",    folder);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String url = (String) response.getBody().get("secure_url");
                log.info("[Cloudinary] Upload OK → {}", url);
                return url;
            }
            throw new IllegalStateException("Cloudinary statut inattendu : " + response.getStatusCode());

        } catch (IOException e) {
            throw new IllegalStateException("Impossible de lire le fichier : " + e.getMessage(), e);
        }
    }

    private void valider(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Le fichier est vide.");
        String ct = file.getContentType();
        if (ct == null || !TYPES_AUTORISES.contains(ct))
            throw new IllegalArgumentException("Format non supporté. Utilisez JPEG, PNG ou WEBP.");
        if (file.getSize() > TAILLE_MAX)
            throw new IllegalArgumentException("Fichier trop volumineux (max 10 Mo).");
    }

    private String signer(long timestamp) {
        return sha256("folder=" + folder + "&timestamp=" + timestamp + apiSecret);
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 non disponible", e);
        }
    }
}
