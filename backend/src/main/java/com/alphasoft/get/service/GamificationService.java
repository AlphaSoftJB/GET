package com.alphasoft.get.service;

import com.alphasoft.get.model.Achievement;
import com.alphasoft.get.model.User;
import com.alphasoft.get.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GamificationService {
    private final AchievementRepository achievementRepository;

    public Achievement awardAchievement(User user, String name, String description, Integer points) {
        log.info("Awarding achievement: {} to user: {}", name, user.getEmail());
        Achievement achievement = Achievement.builder()
                .user(user)
                .name(name)
                .description(description)
                .earnedAt(LocalDateTime.now())
                .points(points)
                .build();
        return achievementRepository.save(achievement);
    }

    public List<Achievement> getUserAchievements(User user) {
        return achievementRepository.findByUser(user);
    }

    public Integer getTotalPoints(User user) {
        return getUserAchievements(user).stream()
                .mapToInt(Achievement::getPoints)
                .sum();
    }
}
