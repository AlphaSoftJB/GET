package com.alphasoft.get.service.iot;
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
class IoTServiceTest {

    @Autowired
    private IoTService ioTService;

    @Test
    void testDeviceConnection() {
        String deviceId = "fridge-123";
        IoTService.DeviceStatus status = ioTService.connectDevice(deviceId);
        
        assertNotNull(status);
        assertEquals(deviceId, status.getDeviceId());
        assertTrue(status.isConnected());
        assertTrue(status.getTemperature() > 0);
    }

    @Test
    void testInventorySync() {
        String deviceId = "fridge-123";
        List<String> items = ioTService.syncFridgeInventory(deviceId);
        
        assertNotNull(items);
        assertFalse(items.isEmpty());
        assertTrue(items.contains("Milk"));
    }
}
