package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.service.RoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RoleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private RoleController roleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(roleController).build();
    }

    @Test
    void testGetAllRoles() throws Exception {
        Role r1 = new Role();
        r1.setRole_id(1);
        r1.setRole_name("ADMIN");

        when(roleService.getAll()).thenReturn(Arrays.asList(r1));

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].role_id").value(1))
                .andExpect(jsonPath("$[0].role_name").value("ADMIN"));
    }

    @Test
    void testGetRoleById_Found() throws Exception {
        Role role = new Role();
        role.setRole_id(1);
        role.setRole_name("USER");

        when(roleService.getById(1)).thenReturn(role);

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role_name").value("USER"));
    }

    @Test
    void testGetRoleById_NotFound() throws Exception {
        when(roleService.getById(1)).thenThrow(new RuntimeException("Role not found"));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateRole() throws Exception {
        Role role = new Role();
        role.setRole_name("REVIEWER");
        role.setDescription("Can review papers");

        when(roleService.create(any(Role.class))).thenReturn(role);

        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(role)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role_name").value("REVIEWER"));
    }

    @Test
    void testUpdateRole_Success() throws Exception {
        Role updatedRole = new Role();
        updatedRole.setRole_name("CHAIR");

        when(roleService.update(eq(1), any(Role.class))).thenReturn(updatedRole);

        mockMvc.perform(put("/api/roles/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedRole)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role_name").value("CHAIR"));
    }

    @Test
    void testDeleteRole_Success() throws Exception {
        doNothing().when(roleService).delete(1);

        mockMvc.perform(delete("/api/roles/1"))
                .andExpect(status().isNoContent());

        verify(roleService, times(1)).delete(1);
    }
}