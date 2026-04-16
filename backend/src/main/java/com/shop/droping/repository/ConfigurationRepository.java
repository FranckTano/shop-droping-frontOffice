package com.shop.droping.repository;

import com.shop.droping.domain.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {

    Optional<Configuration> findByCle(String cle);

    boolean existsByCle(String cle);
}

