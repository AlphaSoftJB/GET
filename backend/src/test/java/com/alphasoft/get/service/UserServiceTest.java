package com.alphasoft.get.service;

import com.alphasoft.get.model.User;
import com.alphasoft.get.repository.UserRepository;
import com.alphasoft.get.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testRegisterAndLogin() {
        User user = User.builder()
                .email("service@example.com")
                .password("password123")
                .role(User.Role.USER)
                .build();

        User registeredUser = userService.registerUser(user);
        assertNotNull(registeredUser.getId());
        assertTrue(userRepository.findByEmail("service@example.com").isPresent());

        String token = userService.login("service@example.com", "password123");
        assertNotNull(token);
    }

    @Test
    void testLoginWithWrongPassword() {
        User user = User.builder()
                .email("wrongpass@example.com")
                .password("password123")
                .role(User.Role.USER)
                .build();
        userService.registerUser(user);

        assertThrows(RuntimeException.class, () -> {
            userService.login("wrongpass@example.com", "wrongpassword");
        });
    }
}
