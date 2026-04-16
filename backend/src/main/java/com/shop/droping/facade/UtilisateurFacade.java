package com.shop.droping.facade;

import com.shop.droping.domain.Utilisateur;
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

	/**
	 * Liste tous les utilisateurs.
	 *
	 * @return la liste {@link UtilisateurDto} des utilisateurs.
	 */
	@Transactional(readOnly = true)
	public List<UtilisateurDto> lister() {
		return utilisateurRepository.findAll()
				.stream()
				.map(UtilisateurDto::new)
				.sorted(comparing(UtilisateurDto::getNom, String.CASE_INSENSITIVE_ORDER)
						.thenComparing(UtilisateurDto::getPrenoms, String.CASE_INSENSITIVE_ORDER))
				.toList();
	}

	/**
	 * Enregistre un utilisateur.
	 *
	 * @param utilisateurDto l'utilisateur.
	 */
	@Transactional
	public void enregistrer(UtilisateurDto utilisateurDto) {
		Utilisateur utilisateur = new Utilisateur(utilisateurDto.getUsername(),
													crypterPassword(utilisateurDto.getPassword()),
													utilisateurDto.getNom(),
													utilisateurDto.getPrenoms(),
													utilisateurDto.getRole(),
													utilisateurDto.getStatut());
		this.utilisateurRepository.save(utilisateur);
	}
}
