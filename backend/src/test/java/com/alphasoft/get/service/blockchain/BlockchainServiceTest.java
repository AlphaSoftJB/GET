package com.alphasoft.get.service.blockchain;
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
class BlockchainServiceTest {

    @Autowired
    private BlockchainService blockchainService;

    @Test
    void testRecordAndVerifyTransaction() {
        String userId = "user-123";
        String action = "ADD_ITEM";
        String details = "Milk added to inventory";

        String hash = blockchainService.recordTransaction(userId, action, details);
        assertNotNull(hash);
        assertTrue(blockchainService.verifyIntegrity(hash));
    }
}
