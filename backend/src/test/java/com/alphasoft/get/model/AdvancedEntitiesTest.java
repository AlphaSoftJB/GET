package com.alphasoft.get.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class AdvancedEntitiesTest {
    @Test
    void testNutritionalInfoCreation() {
        Inventory item = Inventory.builder().name("Apple").build();
        NutritionalInfo info = NutritionalInfo.builder()
                .inventory(item)
                .calories(52.0)
                .protein(0.3)
                .fat(0.2)
                .carbohydrates(14.0)
                .build();

        assertEquals(52.0, info.getCalories());
        assertEquals("Apple", info.getInventory().getName());
    }

    @Test
    void testAchievementCreation() {
        User user = User.builder().email("test@example.com").build();
        Achievement achievement = Achievement.builder()
                .user(user)
                .name("First Item Added")
                .description("You added your first grocery item!")
                .earnedAt(LocalDateTime.now())
                .points(10)
                .build();

        assertEquals("First Item Added", achievement.getName());
        assertEquals(10, achievement.getPoints());
        assertEquals("test@example.com", achievement.getUser().getEmail());
    }
}
