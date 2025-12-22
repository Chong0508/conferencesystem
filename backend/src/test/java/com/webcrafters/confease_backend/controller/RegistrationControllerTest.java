package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Registration;
import com.webcrafters.confease_backend.repository.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RegistrationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RegistrationRepository registrationRepository;

    @InjectMocks
    private RegistrationController registrationController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(registrationController).build();
    }

    @Test
    void testGetAllRegistrations() throws Exception {
        Registration reg = new Registration();
        reg.setRegistration_id(1L);
        reg.setRegistration_type("Regular");

        when(registrationRepository.findAll()).thenReturn(Arrays.asList(reg));

        mockMvc.perform(get("/api/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].registration_id").value(1))
                .andExpect(jsonPath("$[0].registration_type").value("Regular"));
    }

    @Test
    void testGetRegistrationById_Found() throws Exception {
        Registration reg = new Registration();
        reg.setRegistration_id(1L);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(reg));

        mockMvc.perform(get("/api/registrations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registration_id").value(1));
    }

    @Test
    void testGetRegistrationById_NotFound() throws Exception {
        when(registrationRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/registrations/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateRegistration() throws Exception {
        Registration reg = new Registration();
        reg.setRegistration_type("Early Bird");
        reg.setEarly_bird(true);

        when(registrationRepository.save(any(Registration.class))).thenReturn(reg);

        mockMvc.perform(post("/api/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.registration_type").value("Early Bird"))
                .andExpect(jsonPath("$.early_bird").value(true));
    }

    @Test
    void testUpdateRegistration_Success() throws Exception {
        Registration existing = new Registration();
        existing.setRegistration_id(1L);
        
        Registration updatedDetails = new Registration();
        updatedDetails.setPayment_status("Paid");

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(registrationRepository.save(any(Registration.class))).thenReturn(existing);

        mockMvc.perform(put("/api/registrations/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.payment_status").value("Paid"));
    }

    @Test
    void testDeleteRegistration_Success() throws Exception {
        when(registrationRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/registrations/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteRegistration_NotFound() throws Exception {
        when(registrationRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/registrations/1"))
                .andExpect(status().isNotFound());
    }
}