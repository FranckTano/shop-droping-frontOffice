package com.shop.droping.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final LogoutHandler logoutHandler;

    private static final String[] PUBLIC_GET = {
            "/api/produits",
            "/api/produits/**",
            "/api/categories",
            "/api/categories/**",
            "/api/commandes/suivi/**",
            "/api/config/**",
            "/assets/**",
            "/images/**",
            "/uploads/**",
            "/fichiers/**",
            // Routes SPA Angular (PathLocationStrategy)
            "/",
            "/boutique",
            "/boutique/**",
            "/connexion",
            "/connexion/**",
            "/index.html"
    };

    private static final String[] PUBLIC_ANY = {
            "/ws/securite/auth/**",
            "/api/commandes",
            "/api/paiement/webhook",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/webjars/**",
            "/websocket/**"
    };

    public SecurityConfig(JwtRequestFilter jwtRequestFilter, LogoutHandler logoutHandler) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.logoutHandler = logoutHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Endpoints publics (GET)
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET).permitAll()
                        // Endpoints publics (toutes méthodes)
                        .requestMatchers(PUBLIC_ANY).permitAll()
                        // POST public pour créer une commande et initier un paiement
                        .requestMatchers(HttpMethod.POST, "/api/commandes").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/paiement/initier/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/paiement/statut/**").permitAll()
                        // Admin: ADMIN ou SUPER_ADMIN
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "SUPER_ADMIN")
                        // Utilisateurs: SUPER_ADMIN uniquement
                        .requestMatchers("/api/utilisateurs/**").hasAuthority("SUPER_ADMIN")
                        // Tout le reste nécessite authentification
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/ws/auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) ->
                                SecurityContextHolder.clearContext())
                );
        return http.build();
    }
}
