package com.shop.droping.exception;

import com.shop.droping.exception.configuration.AbstractApplicationException;
import com.shop.droping.exception.configuration.CodeErreurTechnique;

import java.util.Collection;

import static java.util.Collections.singleton;

public class UtilisateurException extends AbstractApplicationException {

	private UtilisateurException(CodeErreurTechnique codeErreur, String message) {
		super(codeErreur.getCode(), message);
	}

	private UtilisateurException(CodeErreurTechnique codeErreur, String message, Collection<String> parametres) {
		super(codeErreur.getCode(), message, parametres);
	}

	/**
	 * Exception levée si aucun utilisateur n'est trouvé.
	 */
	public static UtilisateurException motDePasseIncorrect() {
		// Message identique à utiilisateurInconnu pour empêcher l'énumération des comptes
		return new UtilisateurException(CodeErreurTechnique.MOT_DE_PASSE_INCORRECT, "Identifiants incorrects");
	}

	public static UtilisateurException utilisateurInactif() {
		return new UtilisateurException(CodeErreurTechnique.UTILISATEUR_INNACTIF, "Cet utilisateur est inactif. Contactez votre administrateur");
	}

	public static UtilisateurException utiilisateurInconnu(String nomUtilisateur) {
		// Même message que motDePasseIncorrect — ne pas révéler si le login existe
		return new UtilisateurException(CodeErreurTechnique.UTILISATEUR_INCONNU, "Identifiants incorrects");
	}

	/**
	 * Exception levée lorsque le token a expiré.
	 */
	public static UtilisateurException sessionExpiree() {
		return new UtilisateurException(CodeErreurTechnique.ACCES_REFUSE, "Desolé votre token n'est plus valide");
	}
}
