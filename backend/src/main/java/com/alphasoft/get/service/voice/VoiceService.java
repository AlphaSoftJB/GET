package com.alphasoft.get.service.voice;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class VoiceService {

    public VoiceCommandResult processCommand(String transcript) {
        log.info("Processing voice command: {}", transcript);
        
        VoiceCommandResult result = new VoiceCommandResult();
        result.setOriginalTranscript(transcript);

        if (transcript.toLowerCase().contains("add")) {
            result.setAction("ADD_ITEM");
            result.setExtractedItem(extractItem(transcript));
            result.setResponse("Okay, I've added " + result.getExtractedItem() + " to your inventory.");
        } else if (transcript.toLowerCase().contains("expiring")) {
            result.setAction("QUERY_EXPIRATION");
            result.setResponse("You have 3 items expiring soon.");
        } else {
            result.setAction("UNKNOWN");
            result.setResponse("I'm sorry, I didn't understand that command.");
        }

        return result;
    }

    private String extractItem(String transcript) {
        Pattern pattern = Pattern.compile("add\\s+(.+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(transcript);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "unknown item";
    }

    @Data
    public static class VoiceCommandResult {
        private String originalTranscript;
        private String action;
        private String extractedItem;
        private String response;
    }
}
