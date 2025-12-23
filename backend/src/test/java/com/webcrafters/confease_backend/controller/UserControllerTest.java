package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.repository.UserRepository;
import com.webcrafters.confease_backend.repository.RoleRepository;
import com.webcrafters.confease_backend.repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testCreateUser_Success() throws Exception {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword_hash("password123"); 
        user.setCategory("Author");

        Role role = new Role();
        role.setRole_id(1);
        role.setRole_name("Author");

        when(userRepository.count()).thenReturn(1L);
        when(userRepository.findByEmail(anyString())).thenReturn(null);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_pass");
        when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);
        when(roleRepository.findByRoleName("Author")).thenReturn(role);

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Registration successful!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        User user = new User();
        user.setUser_id(1L);
        user.setEmail("login@test.com");
        user.setPassword_hash("hashed_password");
        user.setCategory("Admin");

        when(userRepository.findByEmail("login@test.com")).thenReturn(user);
        // Mock the password match logic 
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        UserController.LoginRequest loginRequest = new UserController.LoginRequest();
        loginRequest.setEmail("login@test.com");
        loginRequest.setPassword("rawPassword");

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void testDeleteUser_Found() throws Exception {
        Long userId = 1L;
        User user = new User();
        user.setUser_id(userId);

        // Mock finding the user
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        // Mock finding the role mapping (so deleteUser logic doesn't fail)
        when(userRoleRepository.findByUserId(userId)).thenReturn(new UserRole());

        mockMvc.perform(delete("/users/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully."));
    }
}