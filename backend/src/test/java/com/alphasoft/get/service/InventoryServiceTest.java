package com.alphasoft.get.service;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import com.alphasoft.get.model.Inventory;
import com.alphasoft.get.model.Household;
import com.alphasoft.get.repository.HouseholdRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class InventoryServiceTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private HouseholdRepository householdRepository;

    @Test
    void testAddAndGetInventory() {
        Household household = Household.builder().name("Test House").build();
        household = householdRepository.save(household);

        Inventory item = Inventory.builder()
                .name("Milk")
                .category("Dairy")
                .expirationDate(LocalDate.now().plusDays(5))
                .quantity(2)
                .household(household)
                .build();

        inventoryService.addItem(item);

        List<Inventory> inventory = inventoryService.getInventoryByHousehold(household);
        assertEquals(1, inventory.size());
        assertEquals("Milk", inventory.get(0).getName());
    }
}
