package com.alphasoft.get.service.ai;

import com.alphasoft.get.model.Inventory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {

    public LocalDate predictExpirationDate(String itemName, String category) {
        log.info("Predicting expiration date for item: {} in category: {}", itemName, category);
        // Simplified ML logic for prediction (mocking TensorFlow interaction)
        int averageDays = switch (category.toLowerCase()) {
            case "dairy" -> 7;
            case "produce" -> 5;
            case "meat" -> 3;
            case "pantry" -> 180;
            default -> 14;
        };
        return LocalDate.now().plusDays(averageDays);
    }

    public List<String> getRecommendations(List<Inventory> currentInventory) {
        log.info("Generating recommendations based on inventory size: {}", currentInventory.size());
        // Simplified recommendation logic
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Based on your dairy consumption, we recommend buying Milk.");
        recommendations.add("You have items expiring soon, try making a vegetable soup.");
        return recommendations;
    }
}
