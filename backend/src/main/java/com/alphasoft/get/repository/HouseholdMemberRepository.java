package com.alphasoft.get.repository;

import com.alphasoft.get.model.HouseholdMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, Long> {
    List<HouseholdMember> findByHouseholdId(Long householdId);
    List<HouseholdMember> findByUserId(Long userId);
    Optional<HouseholdMember> findByHouseholdIdAndUserId(Long householdId, Long userId);
    boolean existsByHouseholdIdAndUserId(Long householdId, Long userId);
}
