package com.alphasoft.get.dto;

import com.alphasoft.get.model.InventoryItem.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDto {

    private UUID id;

    @NotNull(message = "Household ID is required")
    private UUID householdId;

    private UUID addedById;

    @NotBlank(message = "Item name is required")
    private String name;

    private String brand;
    private String barcode;
    private String category;

    @Positive(message = "Quantity must be positive")
    @Builder.Default
    private double quantity = 1.0;

    private String unit;
    private LocalDate expirationDate;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private String imageUrl;
    private String notes;

    @Builder.Default
    private ItemStatus status = ItemStatus.ACTIVE;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
