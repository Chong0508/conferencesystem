package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.*;
import com.webcrafters.confease_backend.service.ReviewerService;
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
    private LogActivityRepository logActivityRepository; // ADDED: To fix NullPointerException

    @Mock
    private ReviewerApplicationRepository applicationRepository; // ADDED: Required by UserController

    @Mock
    private ReviewerService reviewerService; // ADDED: Required by UserController

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
        user.setUser_id(1L);
        user.setEmail("test@example.com");
        user.setPassword_hash("password123"); 
        user.setCategory("Author");

        Role role = new Role();
        role.setRole_id(1);
        role.setRole_name("Author");

        // Mocking the flows in UserController.createUser()
        when(userRepository.count()).thenReturn(1L);
        when(userRepository.findByEmail(anyString())).thenReturn(null);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_pass");
        when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);
        when(roleRepository.findByRoleName("Author")).thenReturn(role);
        
        // Mocking the LogActivity save to prevent NPE
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(new LogActivity());

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
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        
        // Mocking the LogActivity save for login
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(new LogActivity());

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
        user.setEmail("delete@test.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRoleRepository.findByUserId(userId)).thenReturn(new UserRole());
        
        // Mocking the LogActivity save for deletion
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(new LogActivity());

        mockMvc.perform(delete("/users/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully."));
    }
}