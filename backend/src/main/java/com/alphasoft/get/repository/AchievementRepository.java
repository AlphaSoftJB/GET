package com.alphasoft.get.repository;

import com.alphasoft.get.model.Achievement;
import com.alphasoft.get.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUser(User user);
}
