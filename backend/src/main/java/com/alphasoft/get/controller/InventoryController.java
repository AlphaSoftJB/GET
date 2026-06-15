package com.alphasoft.get.controller;

import com.alphasoft.get.model.Inventory;
import com.alphasoft.get.model.Household;
import com.alphasoft.get.service.InventoryService;
import com.alphasoft.get.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;
    private final HouseholdService householdService;

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<Inventory>> getInventory(@PathVariable Long householdId) {
        Household household = householdService.getHouseholdById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));
        return ResponseEntity.ok(inventoryService.getInventoryByHousehold(household));
    }

    @PostMapping
    public ResponseEntity<Inventory> addItem(@RequestBody Inventory item) {
        return ResponseEntity.ok(inventoryService.addItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateItem(@PathVariable Long id, @RequestBody Inventory item) {
        item.setId(id);
        return ResponseEntity.ok(inventoryService.updateItem(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
