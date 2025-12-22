package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.UserRoleId;
import com.webcrafters.confease_backend.service.UserRoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Timestamp;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserRoleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserRoleService userRoleService;

    @InjectMocks
    private UserRoleController userRoleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userRoleController).build();
    }

    @Test
    void testGetAllUserRoles() throws Exception {
        UserRole ur = new UserRole();
        ur.setUser_id(1L);
        ur.setRole_id(2);

        when(userRoleService.getAll()).thenReturn(Arrays.asList(ur));

        mockMvc.perform(get("/api/user-roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].user_id").value(1))
                .andExpect(jsonPath("$[0].role_id").value(2));
    }

    @Test
    void testGetUserRoleById() throws Exception {
        UserRoleId id = new UserRoleId(1L, 2);
        UserRole ur = new UserRole();
        ur.setUser_id(1L);
        ur.setRole_id(2);

        when(userRoleService.getById(any(UserRoleId.class))).thenReturn(ur);

        mockMvc.perform(get("/api/user-roles/by-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value(1))
                .andExpect(jsonPath("$.role_id").value(2));
    }

    @Test
    void testCreateUserRole() throws Exception {
        UserRole ur = new UserRole();
        ur.setUser_id(3L);
        ur.setRole_id(1);
        ur.setAssigned_at(new Timestamp(System.currentTimeMillis()));

        when(userRoleService.create(any(UserRole.class))).thenReturn(ur);

        mockMvc.perform(post("/api/user-roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ur)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user_id").value(3));
    }

    @Test
    void testDeleteUserRole() throws Exception {
        UserRoleId id = new UserRoleId(1L, 2);

        mockMvc.perform(delete("/api/user-roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(id)))
                .andExpect(status().isNoContent());
    }
}