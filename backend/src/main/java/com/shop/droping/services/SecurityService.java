package com.shop.droping.services;

import com.shop.droping.domain.Utilisateur;
import com.shop.droping.enums.StatutUtilisateur;
import com.shop.droping.repository.UtilisateurRepository;
import com.shop.droping.security.JwtTokenUtils;
import com.shop.droping.presentation.dto.auth.AuthDto;
import com.shop.droping.presentation.dto.auth.TokenDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

import static com.shop.droping.exception.UtilisateurException.motDePasseIncorrect;
import static com.shop.droping.exception.UtilisateurException.utiilisateurInconnu;
import static com.shop.droping.exception.UtilisateurException.utilisateurInactif;

@Service
public class SecurityService implements UserDetailsService {

    // Singleton : BCryptPasswordEncoder est thread-safe et coûteux à instancier
    private static final BCryptPasswordEncoder PASSWORD_ENCODER =
            new BCryptPasswordEncoder(10, new SecureRandom());

    private final JwtTokenUtils jwtTokenUtils;
    private final UtilisateurRepository utilisateurRepository;

    public SecurityService(JwtTokenUtils jwtTokenUtils, UtilisateurRepository utilisateurRepository) {
        this.jwtTokenUtils = jwtTokenUtils;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return utilisateurRepository.rechercherParUsername(username.trim())
                .map(Utilisateur::buildUser)
                .orElseThrow(() -> utiilisateurInconnu(username));
    }

    private Utilisateur rechercherUtilisateurParUsernameEtPassword(String username, String password) {
        Utilisateur utilisateur = utilisateurRepository.rechercherParUsername(username)
                .orElseThrow(() -> utiilisateurInconnu(username));
        if (PASSWORD_ENCODER.matches(password, utilisateur.getPassword())) {
            return utilisateur;
        }
        throw motDePasseIncorrect();
    }

    @Transactional
    public TokenDto autentifier(AuthDto authDto) {
        Utilisateur utilisateur = rechercherUtilisateurParUsernameEtPassword(
                authDto.getUsername(), authDto.getPassword());
        if (utilisateur.getStatut().equals(StatutUtilisateur.INACTIF)) {
            throw utilisateurInactif();
        }
        SecurityContextHolder.clearContext();
        String accessToken = jwtTokenUtils.generateToken(utilisateur);
        return new TokenDto(accessToken);
    }

    public static String crypterPassword(String password) {
        return PASSWORD_ENCODER.encode(password);
    }
}
