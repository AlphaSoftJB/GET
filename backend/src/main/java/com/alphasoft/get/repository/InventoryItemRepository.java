package com.alphasoft.get.repository;

import com.alphasoft.get.model.InventoryItem;
import com.alphasoft.get.model.InventoryItem.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByHouseholdIdAndStatus(Long householdId, ItemStatus status);
    List<InventoryItem> findByExpirationDateBefore(LocalDate date);
    Optional<InventoryItem> findByBarcode(String barcode);
    List<InventoryItem> findByHouseholdId(Long householdId);

    @Query("SELECT i FROM InventoryItem i WHERE i.household.id = :householdId " +
           "AND i.expirationDate IS NOT NULL " +
           "AND i.expirationDate BETWEEN :now AND :threshold " +
           "AND i.status = 'ACTIVE' " +
           "ORDER BY i.expirationDate ASC")
    List<InventoryItem> findExpiringItems(
            @Param("householdId") Long householdId,
            @Param("now") LocalDate now,
            @Param("threshold") LocalDate threshold);

    @Query("SELECT i FROM InventoryItem i WHERE i.household.id = :householdId " +
           "AND i.expirationDate IS NOT NULL " +
           "AND i.expirationDate < :now " +
           "AND i.status = 'ACTIVE' " +
           "ORDER BY i.expirationDate ASC")
    List<InventoryItem> findExpiredItems(
            @Param("householdId") Long householdId,
            @Param("now") LocalDate now);
}
