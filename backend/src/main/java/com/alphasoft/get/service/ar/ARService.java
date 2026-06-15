package com.alphasoft.get.service.ar;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ARService {

    public ProductARData getProductARData(String barcode) {
        log.info("Fetching AR data for barcode: {}", barcode);
        // Simplified logic to return AR metadata and 3D model links
        ProductARData data = new ProductARData();
        data.setBarcode(barcode);
        data.setProductName("Sample Product");
        data.setIngredients(List.of("Ingredient 1", "Ingredient 2", "Ingredient 3"));
        data.setThreeDModelUrl("https://assets.getapp.com/models/sample_product.glb");
        data.setAllergenWarnings(Map.of("Dairy", true, "Nuts", false));
        return data;
    }

    @Data
    public static class ProductARData {
        private String barcode;
        private String productName;
        private List<String> ingredients;
        private String threeDModelUrl;
        private Map<String, Boolean> allergenWarnings;
    }
}
