export interface BackendProductSizeDto {
    id: number;
    taille: string;
    stock: number;
    enStock: boolean;
}

export interface BackendProductDto {
    id: number;
    nom: string;
    description: string | null;
    prix: number;
    prixPromo: number | null;
    prixEffectif: number;
    imagePrincipale: string | null;
    actif: boolean;
    enPromotion: boolean;
    nouveau: boolean;
    equipe: string | null;
    saison: string | null;
    marque: string | null;
    couleursDisponibles: string[];
    categorieId: number | null;
    categorieNom: string | null;
    images: string[];
    tailles: BackendProductSizeDto[];
    stockTotal: number;
    enStock: boolean;
}

export interface BackendCategoryDto {
    id: number;
    nom: string;
    description: string | null;
    imageUrl: string | null;
    actif: boolean;
    nombreProduits: number | null;
}

export interface ShopProductSize {
    id: number;
    size: string;
    stock: number;
    inStock: boolean;
}

export interface ShopProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    effectivePrice: number;
    primaryImageUrl: string;
    active: boolean;
    onSale: boolean;
    isNew: boolean;
    team: string | null;
    season: string | null;
    brand: string | null;
    colors: string[];
    categoryId: number | null;
    categoryName: string | null;
    galleryUrls: string[];
    sizes: ShopProductSize[];
    stockTotal: number;
    inStock: boolean;
}

export interface ShopCategory {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    active: boolean;
    productCount: number;
}

export interface CartLine {
    productId: number;
    quantity: number;
    size: string | null;
    color: string | null;
}

export interface CartLineDraft {
    quantity?: number;
    size?: string | null;
    color?: string | null;
}

export interface SearchSuggestion {
    product: ShopProduct;
    label: string;
}

export interface CartLineView extends CartLine {
    product: ShopProduct;
    lineTotal: number;
}

export interface CheckoutLine {
    produitId: number;
    taille: string | null;
    couleur: string | null;
    quantite: number;
    badgesOfficiels: boolean;
    flocage: boolean;
    flocageNom: string | null;
    flocageNumero: string | null;
    prixOptionsUnitaire: number;
}

export interface CheckoutRequest {
    clientNom: string;
    clientTelephone: string;
    clientEmail: string;
    clientAdresse: string;
    notes: string;
    lignes: CheckoutLine[];
}