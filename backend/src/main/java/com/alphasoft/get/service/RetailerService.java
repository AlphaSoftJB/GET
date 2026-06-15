package com.alphasoft.get.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class RetailerService {

    public List<PriceComparison> comparePrices(String itemName) {
        log.info("Comparing prices for item: {}", itemName);
        List<PriceComparison> comparisons = new ArrayList<>();
        comparisons.add(new PriceComparison("Retailer A", 2.99, "In Stock"));
        comparisons.add(new PriceComparison("Retailer B", 3.49, "In Stock"));
        comparisons.add(new PriceComparison("Retailer C", 2.75, "Out of Stock"));
        return comparisons;
    }

    public String placeOrder(String retailerName, List<String> items) {
        log.info("Placing order with retailer: {} for {} items", retailerName, items.size());
        return "ORD-" + System.currentTimeMillis();
    }

    @Data
    @RequiredArgsConstructor
    public static class PriceComparison {
        private final String retailerName;
        private final double price;
        private final String availability;
    }
}
