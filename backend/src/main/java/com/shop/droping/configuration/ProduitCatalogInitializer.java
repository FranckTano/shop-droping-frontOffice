package com.shop.droping.configuration;

import com.shop.droping.domain.Categorie;
import com.shop.droping.domain.Produit;
import com.shop.droping.domain.ProduitImage;
import com.shop.droping.domain.ProduitTaille;
import com.shop.droping.repository.CategorieRepository;
import com.shop.droping.repository.ProduitRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
public class ProduitCatalogInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(ProduitCatalogInitializer.class);
    private static final Map<String, String> CATEGORIES_PAR_SLUG = new LinkedHashMap<>();

    static {
        CATEGORIES_PAR_SLUG.put("actuel", "Maillots Actuels");
        CATEGORIES_PAR_SLUG.put("vintage-court", "Maillots Vintage Court");
        CATEGORIES_PAR_SLUG.put("vintage-long", "Maillots Vintage Long");
        CATEGORIES_PAR_SLUG.put("collection", "Maillots Collection");
    }

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public ProduitCatalogInitializer(ProduitRepository produitRepository, CategorieRepository categorieRepository) {
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        Map<String, Categorie> categoriesBySlug = chargerCategories();
        if (categoriesBySlug.isEmpty()) {
            logger.warn("Aucune categorie active trouvee: l'initialisation du catalogue est ignoree.");
            return;
        }

        List<String> imagePaths = chargerCheminsImages(categoriesBySlug.keySet());
        if (imagePaths.isEmpty()) {
            logger.warn("Aucune image detectee dans classpath:/images/**.");
            return;
        }

        List<Produit> produits = produitRepository.findAll();
        Map<String, Produit> produitsParImage = new HashMap<>();
        Map<String, Integer> compteurParCategorie = new HashMap<>();

        for (Produit produit : produits) {
            if (produit.getImagePrincipale() != null && !produit.getImagePrincipale().isBlank()) {
                produitsParImage.put(normalizePath(produit.getImagePrincipale()), produit);
            }

            String slug = slugCategorie(produit.getCategorie() != null ? produit.getCategorie().getNom() : null);
            compteurParCategorie.put(slug, compteurParCategorie.getOrDefault(slug, 0) + 1);
        }

        int creates = 0;
        int updates = 0;

        for (String imagePath : imagePaths) {
            String normalizedPath = normalizePath(imagePath);
            String slug = extraireCategorieDepuisChemin(normalizedPath);
            Categorie categorie = categoriesBySlug.get(slug);
            if (categorie == null) {
                continue;
            }

            Produit produit = produitsParImage.get(normalizedPath);
            if (produit == null) {
                int numero = compteurParCategorie.getOrDefault(slug, 0) + 1;
                compteurParCategorie.put(slug, numero);

                produit = new Produit();
                produit.setNom(genererNomProduit(slug, numero));
                produit.setPrix(prixParCategorie(slug));
                produit.setPrixPromo(null);
                produit.setImagePrincipale(normalizedPath);
                produit.setCategorie(categorie);
                produit.setActif(true);
                produit.setEnPromotion(false);
                produit.setNouveau("actuel".equals(slug));

                enrichirMetadonnees(produit, slug, normalizedPath);
                garantirImagePrincipale(produit, normalizedPath);
                garantirTailles(produit);

                produitRepository.save(produit);
                produitsParImage.put(normalizedPath, produit);
                creates++;
                continue;
            }

            boolean changed = false;
            if (produit.getCategorie() == null) {
                produit.setCategorie(categorie);
                changed = true;
            }
            if (produit.getImagePrincipale() == null || produit.getImagePrincipale().isBlank()) {
                produit.setImagePrincipale(normalizedPath);
                changed = true;
            }
            if (produit.getActif() == null) {
                produit.setActif(true);
                changed = true;
            }

            changed = enrichirMetadonnees(produit, slug, normalizedPath) || changed;
            changed = garantirImagePrincipale(produit, normalizedPath) || changed;
            changed = garantirTailles(produit) || changed;

            if (changed) {
                produitRepository.save(produit);
                updates++;
            }
        }

        logger.info("Catalogue produits synchronise: {} creation(s), {} mise(s) a jour, {} image(s) detectee(s).", creates, updates, imagePaths.size());
    }

    private Map<String, Categorie> chargerCategories() {
        Map<String, Categorie> result = new HashMap<>();
        for (Categorie categorie : categorieRepository.findAll()) {
            result.put(slugCategorie(categorie.getNom()), categorie);
        }

        for (Map.Entry<String, String> entry : CATEGORIES_PAR_SLUG.entrySet()) {
            String slug = entry.getKey();
            String nomCategorie = entry.getValue();

            Categorie categorie = result.get(slug);
            if (categorie == null) {
                categorie = new Categorie();
                categorie.setNom(nomCategorie);
                categorie.setDescription("Catalogue auto-genere pour les visuels " + slug + ".");
                categorie.setImageUrl("images/" + slug + "/");
                categorie.setActif(true);
                categorie = categorieRepository.save(categorie);
                logger.info("Categorie manquante creee automatiquement: {}", nomCategorie);
            } else {
                boolean changed = false;
                if (!Boolean.TRUE.equals(categorie.getActif())) {
                    categorie.setActif(true);
                    changed = true;
                }
                if (isBlank(categorie.getImageUrl())) {
                    categorie.setImageUrl("images/" + slug + "/");
                    changed = true;
                }
                if (isBlank(categorie.getDescription())) {
                    categorie.setDescription("Catalogue auto-genere pour les visuels " + slug + ".");
                    changed = true;
                }
                if (changed) {
                    categorie = categorieRepository.save(categorie);
                }
            }

            result.put(slug, categorie);
        }

        result.entrySet().removeIf(entry -> !Boolean.TRUE.equals(entry.getValue().getActif()));
        return result;
    }

    private List<String> chargerCheminsImages(Set<String> slugs) throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        List<String> paths = new ArrayList<>();

        for (String slug : slugs) {
            if (!CATEGORIES_PAR_SLUG.containsKey(slug)) {
                logger.debug("Categorie '{}' ignoree pour le chargement d'images (slug non supporte).", slug);
                continue;
            }

            try {
                Resource[] resources = resolver.getResources("classpath:/images/" + slug + "/*");
                for (Resource resource : resources) {
                    String filename = resource.getFilename();
                    if (filename == null || filename.isBlank() || !estImage(filename)) {
                        continue;
                    }
                    paths.add("images/" + slug + "/" + filename);
                }
            } catch (FileNotFoundException ex) {
                logger.warn("Dossier d'images introuvable pour la categorie '{}': classpath:/images/{}/", slug, slug);
            }
        }

        paths.sort(Comparator.naturalOrder());
        return paths;
    }

    private boolean estImage(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
    }

    private String slugCategorie(String nomCategorie) {
        if (nomCategorie == null || nomCategorie.isBlank()) {
            return "collection";
        }

        String slug = Normalizer.normalize(nomCategorie.trim(), Normalizer.Form.NFD)
            .replaceAll("\\p{M}+", "")
            .toLowerCase(Locale.ROOT)
            .replace(" ", "-")
            .replace("_", "-");

        return normaliserAliasSlug(slug);
    }

    private String normaliserAliasSlug(String slug) {
        return switch (slug) {
            case "maillots-actuels", "maillots-actuel", "actuels" -> "actuel";
            case "maillots-vintage-court", "maillots-vintage-courts", "vintage-courts" -> "vintage-court";
            case "maillots-vintage-long", "maillots-vintage-longs", "vintage-longs" -> "vintage-long";
            case "maillots-collection", "maillots-collections", "collections" -> "collection";
            default -> slug;
        };
    }

    private String extraireCategorieDepuisChemin(String imagePath) {
        String[] parts = imagePath.split("/");
        if (parts.length >= 3) {
            return parts[1];
        }
        return "collection";
    }

    private String normalizePath(String path) {
        return path.replace('\\', '/').replaceAll("^/+", "");
    }

    private String genererNomProduit(String slug, int numero) {
        return switch (slug) {
            case "actuel" -> "Maillot Actuel " + numero;
            case "vintage-court" -> "Maillot Vintage Court " + numero;
            case "vintage-long" -> "Maillot Vintage Long " + numero;
            case "collection" -> "Maillot Collection " + numero;
            default -> "Maillot " + numero;
        };
    }

    private BigDecimal prixParCategorie(String slug) {
        return switch (slug) {
            case "actuel" -> BigDecimal.valueOf(9000);
            case "vintage-court" -> BigDecimal.valueOf(10000);
            case "vintage-long" -> BigDecimal.valueOf(12000);
            case "collection" -> BigDecimal.valueOf(15000);
            default -> BigDecimal.valueOf(10000);
        };
    }

    private boolean enrichirMetadonnees(Produit produit, String slug, String imagePath) {
        MetaProduit meta = inferMeta(slug, imagePath);
        boolean changed = false;

        if (isBlank(produit.getEquipe())) {
            produit.setEquipe(meta.equipe());
            changed = true;
        }
        if (isBlank(produit.getMarque())) {
            produit.setMarque(meta.marque());
            changed = true;
        }
        if (isBlank(produit.getSaison())) {
            produit.setSaison(meta.saison());
            changed = true;
        }
        if (isBlank(produit.getCouleursDisponibles())) {
            produit.setCouleursDisponibles(meta.couleurs());
            changed = true;
        }

        if (isBlank(produit.getDescription())) {
            produit.setDescription(String.format(
                "Maillot %s, marque %s, saison %s. Tailles disponibles: S, M, L, XL. Couleurs disponibles: %s. Option badges officiels et flocage disponibles.",
                meta.equipe(),
                meta.marque(),
                meta.saison(),
                meta.couleurs()
            ));
            changed = true;
        }

        return changed;
    }

    private boolean garantirImagePrincipale(Produit produit, String imagePath) {
        if (produit.getImages() == null) {
            produit.setImages(new ArrayList<>());
        }

        boolean alreadyExists = produit.getImages().stream()
            .map(ProduitImage::getUrl)
            .anyMatch(url -> normalizePath(url).equals(imagePath));

        if (alreadyExists) {
            return false;
        }

        produit.addImage(new ProduitImage(imagePath, produit.getImages().size()));
        return true;
    }

    private boolean garantirTailles(Produit produit) {
        if (produit.getTailles() == null) {
            produit.setTailles(new ArrayList<>());
        }

        Set<String> existantes = new HashSet<>();
        for (ProduitTaille taille : produit.getTailles()) {
            if (taille.getTaille() != null) {
                existantes.add(taille.getTaille().toUpperCase(Locale.ROOT));
            }
            if (taille.getStock() == null) {
                taille.setStock(5);
            }
        }

        boolean changed = false;
        for (String taille : List.of("S", "M", "L", "XL")) {
            if (!existantes.contains(taille)) {
                produit.addTaille(new ProduitTaille(taille, 5));
                changed = true;
            }
        }

        return changed;
    }

    private MetaProduit inferMeta(String slug, String imagePath) {
        Map<String, MetaProduit> known = Map.of(
            "images/actuel/WhatsApp Image 2026-03-15 at 12.56.58.jpeg", new MetaProduit("Real Madrid", "Adidas", "1984/1985", "Bleu, Blanc, Orange"),
            "images/actuel/WhatsApp Image 2026-03-15 at 12.56.59 (1).jpeg", new MetaProduit("Chelsea FC", "Umbro", "2003/2004", "Bleu"),
            "images/actuel/WhatsApp Image 2026-03-15 at 12.56.59 (2).jpeg", new MetaProduit("Arsenal", "Nike", "2005/2006", "Bordeaux"),
            "images/vintage-court/WhatsApp Image 2026-03-15 at 12.57.08 (1).jpeg", new MetaProduit("Italie", "Nike", "1998", "Blanc, Bleu"),
            "images/vintage-court/WhatsApp Image 2026-03-15 at 12.57.08 (2).jpeg", new MetaProduit("Real Madrid", "Adidas", "1999/2000", "Bleu, Jaune"),
            "images/vintage-long/WhatsApp Image 2026-03-15 at 12.57.12 (2).jpeg", new MetaProduit("Arsenal", "Adidas", "1991/1992", "Rouge, Blanc"),
            "images/vintage-long/WhatsApp Image 2026-03-15 at 12.57.12 (3).jpeg", new MetaProduit("Mexique", "Adidas", "2024", "Blanc, Vert"),
            "images/collection/WhatsApp Image 2026-03-15 at 12.57.16 (3).jpeg", new MetaProduit("AC Milan", "Adidas", "2006/2007", "Blanc, Rouge, Noir"),
            "images/collection/WhatsApp Image 2026-03-15 at 12.57.16 (4).jpeg", new MetaProduit("Lazio", "Puma", "2000", "Noir, Bleu ciel")
        );

        MetaProduit metaConnue = known.get(imagePath);
        if (metaConnue != null) {
            return metaConnue;
        }

        return switch (slug) {
            case "actuel" -> new MetaProduit("Club actuel", "Nike", "2025/2026", "Bleu, Blanc, Rouge, Noir");
            case "vintage-court" -> new MetaProduit("Club vintage", "Adidas", "2000/2001", "Blanc, Noir, Rouge, Bleu");
            case "vintage-long" -> new MetaProduit("Club vintage manches longues", "Puma", "1999/2000", "Blanc, Bleu marine, Noir");
            case "collection" -> new MetaProduit("Edition collection", "Umbro", "Collector", "Multicolore, Blanc, Noir, Bleu");
            default -> new MetaProduit("Equipe legend", "Marque officielle", "Saison iconique", "Blanc, Noir");
        };
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record MetaProduit(String equipe, String marque, String saison, String couleurs) {}
}
