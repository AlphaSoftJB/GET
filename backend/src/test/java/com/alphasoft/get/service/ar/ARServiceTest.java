package com.alphasoft.get.service.ar;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class ARServiceTest {

    @Autowired
    private ARService arService;

    @Test
    void testGetProductARData() {
        String barcode = "1234567890";
        ARService.ProductARData data = arService.getProductARData(barcode);
        
        assertNotNull(data);
        assertEquals(barcode, data.getBarcode());
        assertFalse(data.getIngredients().isEmpty());
        assertNotNull(data.getThreeDModelUrl());
    }
}
