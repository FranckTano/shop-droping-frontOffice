package com.shop.droping.utils;

import java.time.Instant;
import java.util.Random;

public class RandomUtils {

     // generer un numero aléatoire
    public static String genererNumeroFiche() {
        Random random = new Random();
        int numero = random.nextInt(100000);
        return String.format("%06d", numero);
    }

    public static String genererNomFiche(String type) {
       
           // 🔹 Nom du fichier de sortie
            long timeStampMillis = Instant.now().toEpochMilli();

            String nomFichier = "fiche_" + type + "_" + timeStampMillis + ".pdf";
            return nomFichier;
    }
    
}
