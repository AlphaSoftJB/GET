package com.alphasoft.get.service;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class RetailerServiceTest {

    @Autowired
    private RetailerService retailerService;

    @Test
    void testPriceComparison() {
        List<RetailerService.PriceComparison> prices = retailerService.comparePrices("Milk");
        assertNotNull(prices);
        assertEquals(3, prices.size());
        assertTrue(prices.get(0).getPrice() > 0);
    }

    @Test
    void testPlaceOrder() {
        String orderId = retailerService.placeOrder("Retailer A", List.of("Milk", "Eggs"));
        assertNotNull(orderId);
        assertTrue(orderId.startsWith("ORD-"));
    }
}
