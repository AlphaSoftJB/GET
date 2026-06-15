package com.alphasoft.get.service;

import com.alphasoft.get.model.Household;
import com.alphasoft.get.model.User;
import com.alphasoft.get.repository.HouseholdRepository;
import com.alphasoft.get.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HouseholdService {
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public Household createHousehold(String name, User owner) {
        Household household = Household.builder()
                .name(name)
                .members(new ArrayList<>())
                .build();
        household.getMembers().add(owner);
        return householdRepository.save(household);
    }

    public void addMember(Long householdId, String userEmail) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!household.getMembers().contains(user)) {
            household.getMembers().add(user);
            householdRepository.save(household);
            // Notify other members via Kafka
            kafkaTemplate.send("household-sync", "Member added: " + userEmail + " to household: " + householdId);
        }
    }

    public Optional<Household> getHouseholdById(Long id) {
        return householdRepository.findById(id);
    }
}
