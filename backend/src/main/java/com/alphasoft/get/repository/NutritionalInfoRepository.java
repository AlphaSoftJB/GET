package com.alphasoft.get.repository;

import com.alphasoft.get.model.NutritionalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NutritionalInfoRepository extends JpaRepository<NutritionalInfo, Long> {
    Optional<NutritionalInfo> findByInventoryId(Long inventoryId);
}
