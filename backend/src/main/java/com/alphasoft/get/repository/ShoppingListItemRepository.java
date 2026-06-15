package com.alphasoft.get.repository;

import com.alphasoft.get.model.ShoppingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Long> {
    List<ShoppingListItem> findByHouseholdId(Long householdId);
    List<ShoppingListItem> findByHouseholdIdAndChecked(Long householdId, boolean checked);
    List<ShoppingListItem> findByHouseholdIdOrderByPriorityDescCreatedAtAsc(Long householdId);
}
