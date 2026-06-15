package com.alphasoft.get.service;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.alphasoft.get.config.TestConfig;

import com.alphasoft.get.model.Achievement;
import com.alphasoft.get.model.User;
import com.alphasoft.get.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class GamificationServiceTest {

    @Autowired
    private GamificationService gamificationService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testAwardAndGetAchievements() {
        User user = User.builder().email("gamer@example.com").password("pass").build();
        user = userRepository.save(user);

        gamificationService.awardAchievement(user, "First Item", "Added your first item", 10);
        gamificationService.awardAchievement(user, "Week Streak", "Tracked for 7 days", 50);

        List<Achievement> achievements = gamificationService.getUserAchievements(user);
        assertEquals(2, achievements.size());
        assertEquals(60, gamificationService.getTotalPoints(user));
    }
}
