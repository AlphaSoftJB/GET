package com.alphasoft.get.repository;

import com.alphasoft.get.model.Inventory;
import com.alphasoft.get.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByHousehold(Household household);
}
