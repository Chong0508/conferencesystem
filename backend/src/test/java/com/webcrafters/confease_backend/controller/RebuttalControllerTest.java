package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Rebuttal;
import com.webcrafters.confease_backend.repository.RebuttalRepository;
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

class RebuttalControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RebuttalRepository rebuttalRepository;

    @InjectMocks
    private RebuttalController rebuttalController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(rebuttalController).build();
    }

    @Test
    void testGetAllRebuttals() throws Exception {
        Rebuttal r1 = new Rebuttal();
        r1.setRebuttal_id(1L);
        r1.setContent("This is a test rebuttal.");

        when(rebuttalRepository.findAll()).thenReturn(Arrays.asList(r1));

        mockMvc.perform(get("/api/rebuttals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rebuttal_id").value(1))
                .andExpect(jsonPath("$[0].content").value("This is a test rebuttal."));
    }

    @Test
    void testGetRebuttalById_Found() throws Exception {
        Rebuttal rebuttal = new Rebuttal();
        rebuttal.setRebuttal_id(1L);

        when(rebuttalRepository.findById(1L)).thenReturn(Optional.of(rebuttal));

        mockMvc.perform(get("/api/rebuttals/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rebuttal_id").value(1));
    }

    @Test
    void testGetRebuttalById_NotFound() throws Exception {
        when(rebuttalRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rebuttals/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateRebuttal() throws Exception {
        Rebuttal rebuttal = new Rebuttal();
        rebuttal.setPaper_id(10L);
        rebuttal.setContent("New Rebuttal Content");

        when(rebuttalRepository.save(any(Rebuttal.class))).thenReturn(rebuttal);

        mockMvc.perform(post("/api/rebuttals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rebuttal)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paper_id").value(10))
                .andExpect(jsonPath("$.content").value("New Rebuttal Content"));
    }

    @Test
    void testUpdateRebuttal_Success() throws Exception {
        Rebuttal existing = new Rebuttal();
        existing.setRebuttal_id(1L);
        
        Rebuttal updatedDetails = new Rebuttal();
        updatedDetails.setContent("Updated Rebuttal Content");

        when(rebuttalRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(rebuttalRepository.save(any(Rebuttal.class))).thenReturn(existing);

        mockMvc.perform(put("/api/rebuttals/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated Rebuttal Content"));
    }

    @Test
    void testDeleteRebuttal_Success() throws Exception {
        when(rebuttalRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/rebuttals/1"))
                .andExpect(status().isNoContent());
    }
}