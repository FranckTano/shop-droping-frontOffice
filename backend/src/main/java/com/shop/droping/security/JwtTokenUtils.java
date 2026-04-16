package com.shop.droping.security;

import com.shop.droping.domain.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtils implements Serializable {

    private static final long serialVersionUID = -2550185165626007488L;

    @Value("${application.security.jwt.secret-key}")
    private String secret;

    @Value("${application.security.jwt.expiration}")
    private long jwtTokenExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long jwtTokenRefreshTokenExpiration;

    private Key getSigningKey() {
        String configuredSecret = secret == null ? "" : secret.trim();
        byte[] keyBytes;

        if (configuredSecret.startsWith("base64:")) {
            String base64Secret = configuredSecret.substring("base64:".length()).trim();
            keyBytes = Decoders.BASE64.decode(base64Secret);
        } else {
            keyBytes = configuredSecret.getBytes(StandardCharsets.UTF_8);
        }

        if (keyBytes.length < 32) {
            throw new IllegalStateException("La cle JWT doit contenir au moins 32 octets (256 bits).");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Retourne le nom de l'utilisateur compris dans le Token JWT.
     *
     * @param token Le Token JWT.
     * @return le nom de l'utilisateur.
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * Retourne la date d'expiration du Token JWT.
     *
     * @param token Le Token JWT.
     * @return La date d'expiration du Token JWT.
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Retourne les les toutes informations du Token JWT.
     *
     * @param token Le Token JWT.
     * @return le nom de l'utilisateur.
     */
    private Claims getAllClaimsFromToken(String token) {
        Jws<Claims> parsedToken = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);

        return parsedToken.getBody();
    }

    /**
     * Vérifie si le Token JWT a expiré
     *
     * @param token Le Token JWT.
     * @return true si le token a expiré
     */
    public boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Verifie que le token est valid
     *
     * @param token le token
     * @param userDetails les informations de l'utilisateur
     * @return true si le token est valide sinon false
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Génère le Token JWT de l'utilisateur renseigné.
     *
     * @param utilisateur l'utilisateur.
     * @return le Token JWT.
     */
    public String generateToken(Utilisateur utilisateur) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", utilisateur.getId());
        claims.put("nom", utilisateur.getNom());
        claims.put("prenoms", utilisateur.getPrenoms());
        claims.put("username", utilisateur.getUsername());
        claims.put("role", utilisateur.getRole().name());
        claims.put("statut", utilisateur.getStatut());
        return doGenerateToken(claims, utilisateur.getUsername());
    }


    /**
     * Permet de comptacter les attituts de l'utilisateur pour la génération du Token JWT.
     *
     * @param claims Les attributs.
     * @param subject le username de l'utilisateur.
     * @return Les attributs formatés.
     */
    private String doGenerateToken(Map<String, Object> claims, String subject) {

        return Jwts.builder().setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + this.jwtTokenExpiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
}

