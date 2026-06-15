package com.alphasoft.get.dto;

import com.alphasoft.get.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private User.Role role;
}
