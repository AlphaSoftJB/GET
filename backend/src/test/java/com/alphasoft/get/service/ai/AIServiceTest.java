package com.alphasoft.get.service.ai;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import com.alphasoft.get.model.Inventory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class AIServiceTest {

    @Autowired
    private AIService aiService;

    @Test
    void testExpirationPrediction() {
        LocalDate predictedDate = aiService.predictExpirationDate("Milk", "Dairy");
        assertNotNull(predictedDate);
        assertTrue(predictedDate.isAfter(LocalDate.now()));
    }

    @Test
    void testRecommendations() {
        List<Inventory> inventory = new ArrayList<>();
        inventory.add(Inventory.builder().name("Yogurt").category("Dairy").build());
        
        List<String> recommendations = aiService.getRecommendations(inventory);
        assertFalse(recommendations.isEmpty());
        assertTrue(recommendations.get(0).contains("Milk"));
    }
}
