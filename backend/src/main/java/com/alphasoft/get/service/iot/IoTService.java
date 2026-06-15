package com.alphasoft.get.service.iot;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class IoTService {

    public DeviceStatus connectDevice(String deviceId) {
        log.info("Connecting to IoT device: {}", deviceId);
        DeviceStatus status = new DeviceStatus();
        status.setDeviceId(deviceId);
        status.setConnected(true);
        status.setTemperature(3.5); // Sample fridge temperature in Celsius
        status.setLastSync(System.currentTimeMillis());
        return status;
    }

    public List<String> syncFridgeInventory(String deviceId) {
        log.info("Syncing inventory for fridge: {}", deviceId);
        // Mocked inventory sync
        return List.of("Milk", "Eggs", "Butter");
    }

    @Data
    public static class DeviceStatus {
        private String deviceId;
        private boolean connected;
        private double temperature;
        private long lastSync;
    }
}
