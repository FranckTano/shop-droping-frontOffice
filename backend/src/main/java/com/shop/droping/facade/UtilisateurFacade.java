package com.shop.droping.facade;

import com.shop.droping.domain.Utilisateur;
import com.shop.droping.enums.StatutUtilisateur;
import com.shop.droping.presentation.dto.UtilisateurDto;
import com.shop.droping.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.shop.droping.services.SecurityService.crypterPassword;
import static java.util.Comparator.comparing;

@Service
public class UtilisateurFacade {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurFacade(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional(readOnly = true)
    public List<UtilisateurDto> lister() {
        return utilisateurRepository.findAll()
                .stream()
                .map(UtilisateurDto::new)
                .sorted(comparing(UtilisateurDto::getNom, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(UtilisateurDto::getPrenoms, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Transactional
    public void enregistrer(UtilisateurDto dto) {
        Utilisateur utilisateur = new Utilisateur(
                dto.getUsername(),
                crypterPassword(dto.getPassword()),
                dto.getNom(),
                dto.getPrenoms(),
                dto.getRole(),
                dto.getStatut()
        );
        this.utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void mettreAJour(Long id, UtilisateurDto dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + id));

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            utilisateur.mettreAJourUtilisateur(
                    dto.getUsername(), crypterPassword(dto.getPassword()),
                    dto.getNom(), dto.getPrenoms(), dto.getRole(), dto.getStatut()
            );
        } else {
            utilisateur.mettreAjour(dto.getNom(), dto.getPrenoms(), dto.getRole(), dto.getStatut());
        }
        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void changerStatut(Long id, StatutUtilisateur statut) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + id));
        utilisateur.setStatut(statut);
        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void supprimer(Long id) {
        utilisateurRepository.deleteById(id);
    }
}
