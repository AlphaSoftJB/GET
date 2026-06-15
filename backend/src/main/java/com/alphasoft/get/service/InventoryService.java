package com.alphasoft.get.service;

import com.alphasoft.get.model.Inventory;
import com.alphasoft.get.model.Household;
import com.alphasoft.get.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public List<Inventory> getInventoryByHousehold(Household household) {
        return inventoryRepository.findByHousehold(household);
    }

    public Inventory addItem(Inventory item) {
        return inventoryRepository.save(item);
    }

    public Inventory updateItem(Inventory item) {
        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}
