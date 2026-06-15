package com.alphasoft.get.security;

import com.alphasoft.get.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
@TestPropertySource(properties = {
    "jwt.secret=your_jwt_secret_key_here_must_be_at_least_256_bits_long_for_hs256",
    "jwt.expiration=86400000"
})
class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void testTokenGenerationAndValidation() {
        String email = "test@example.com";
        String token = jwtUtils.generateToken(email);
        
        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));
        assertEquals(email, jwtUtils.getEmailFromToken(token));
    }
}
