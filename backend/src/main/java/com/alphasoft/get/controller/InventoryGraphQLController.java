package com.alphasoft.get.controller;

import com.alphasoft.get.model.Inventory;
import com.alphasoft.get.model.Household;
import com.alphasoft.get.service.InventoryService;
import com.alphasoft.get.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class InventoryGraphQLController {
    private final InventoryService inventoryService;
    private final HouseholdService householdService;

    @QueryMapping
    public List<Inventory> inventory(@Argument Long householdId) {
        Household household = householdService.getHouseholdById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));
        return inventoryService.getInventoryByHousehold(household);
    }

    @MutationMapping
    public Inventory addItem(@Argument Map<String, Object> input) {
        Household household = householdService.getHouseholdById(Long.parseLong((String) input.get("householdId")))
                .orElseThrow(() -> new RuntimeException("Household not found"));
        
        Inventory item = Inventory.builder()
                .name((String) input.get("name"))
                .category((String) input.get("category"))
                .expirationDate(LocalDate.parse((String) input.get("expirationDate")))
                .quantity((Integer) input.get("quantity"))
                .location((String) input.get("location"))
                .household(household)
                .build();
        
        return inventoryService.addItem(item);
    }
}
