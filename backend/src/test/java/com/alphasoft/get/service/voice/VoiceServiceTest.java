package com.alphasoft.get.service.voice;
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
class VoiceServiceTest {

    @Autowired
    private VoiceService voiceService;

    @Test
    void testProcessAddCommand() {
        String transcript = "Add milk to inventory";
        VoiceService.VoiceCommandResult result = voiceService.processCommand(transcript);
        
        assertEquals("ADD_ITEM", result.getAction());
        assertTrue(result.getExtractedItem().toLowerCase().contains("milk"));
        assertNotNull(result.getResponse());
    }

    @Test
    void testProcessExpirationQuery() {
        String transcript = "What is expiring soon?";
        VoiceService.VoiceCommandResult result = voiceService.processCommand(transcript);
        
        assertEquals("QUERY_EXPIRATION", result.getAction());
        assertNotNull(result.getResponse());
    }
}
