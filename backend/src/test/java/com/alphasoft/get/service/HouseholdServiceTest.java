package com.alphasoft.get.service;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import com.alphasoft.get.model.Household;
import com.alphasoft.get.model.User;
import com.alphasoft.get.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class HouseholdServiceTest {

    @Autowired
    private HouseholdService householdService;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    void testCreateHouseholdAndAddMember() {
        User owner = User.builder().email("owner@example.com").password("pass").build();
        owner = userRepository.save(owner);

        Household household = householdService.createHousehold("My Household", owner);
        assertNotNull(household.getId());
        assertEquals(1, household.getMembers().size());

        User member = User.builder().email("member@example.com").password("pass").build();
        member = userRepository.save(member);

        householdService.addMember(household.getId(), "member@example.com");
        
        Household updatedHousehold = householdService.getHouseholdById(household.getId()).get();
        assertEquals(2, updatedHousehold.getMembers().size());
    }
}
