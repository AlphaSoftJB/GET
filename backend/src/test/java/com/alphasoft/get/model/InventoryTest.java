package com.alphasoft.get.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class InventoryTest {
    @Test
    void testInventoryCreation() {
        Household household = Household.builder().name("My Home").build();
        Inventory item = Inventory.builder()
                .name("Milk")
                .category("Dairy")
                .expirationDate(LocalDate.now().plusDays(7))
                .quantity(1)
                .location("Fridge")
                .household(household)
                .build();

        assertEquals("Milk", item.getName());
        assertEquals("My Home", item.getHousehold().getName());
        assertTrue(item.getExpirationDate().isAfter(LocalDate.now()));
    }
}
