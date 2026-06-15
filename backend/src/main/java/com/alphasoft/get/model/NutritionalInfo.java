package com.alphasoft.get.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nutritional_info")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double calories;
    private Double protein;
    private Double fat;
    private Double carbohydrates;
    private Double fiber;
    private String allergens;

    @OneToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;
}
