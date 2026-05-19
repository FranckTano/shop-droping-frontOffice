package com.shop.droping.presentation.dto;

import java.math.BigDecimal;

public record DashboardDto(
    long totalCommandes,
    long commandesEnAttente,
    long commandesValidees,
    long commandesLivrees,
    long commandesAnnulees,
    long commandesStandby,
    BigDecimal chiffreAffaires,
    BigDecimal chiffreAffairesLivrees,
    long totalProduits,
    long produitsActifs,
    long produitsArchives
) {}
