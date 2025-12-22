package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.ScoreCriterion;
import com.webcrafters.confease_backend.repository.ScoreCriterionRepository;
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

class ScoreCriterionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ScoreCriterionRepository scoreCriterionRepository;

    @InjectMocks
    private ScoreCriterionController scoreCriterionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(scoreCriterionController).build();
    }

    @Test
    void testGetAllScoreCriteria() throws Exception {
        ScoreCriterion sc1 = new ScoreCriterion();
        sc1.setCriterion_id(1);
        sc1.setName("Originality");

        when(scoreCriterionRepository.findAll()).thenReturn(Arrays.asList(sc1));

        mockMvc.perform(get("/api/score-criteria"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].criterion_id").value(1))
                .andExpect(jsonPath("$[0].name").value("Originality"));
    }

    @Test
    void testGetScoreCriterionById_Found() throws Exception {
        ScoreCriterion sc = new ScoreCriterion();
        sc.setCriterion_id(1);

        when(scoreCriterionRepository.findById(1)).thenReturn(Optional.of(sc));

        mockMvc.perform(get("/api/score-criteria/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criterion_id").value(1));
    }

    @Test
    void testGetScoreCriterionById_NotFound() throws Exception {
        when(scoreCriterionRepository.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/score-criteria/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateScoreCriterion() throws Exception {
        ScoreCriterion sc = new ScoreCriterion();
        sc.setName("Technical Quality");
        sc.setDescription("Measures the technical depth of the paper.");

        when(scoreCriterionRepository.save(any(ScoreCriterion.class))).thenReturn(sc);

        mockMvc.perform(post("/api/score-criteria")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sc)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Technical Quality"));
    }

    @Test
    void testUpdateScoreCriterion_Success() throws Exception {
        ScoreCriterion existing = new ScoreCriterion();
        existing.setCriterion_id(1);
        
        ScoreCriterion updatedDetails = new ScoreCriterion();
        updatedDetails.setName("Updated Quality");

        when(scoreCriterionRepository.findById(1)).thenReturn(Optional.of(existing));
        when(scoreCriterionRepository.save(any(ScoreCriterion.class))).thenReturn(existing);

        mockMvc.perform(put("/api/score-criteria/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Quality"));
    }

    @Test
    void testDeleteScoreCriterion_Success() throws Exception {
        when(scoreCriterionRepository.existsById(1)).thenReturn(true);

        mockMvc.perform(delete("/api/score-criteria/1"))
                .andExpect(status().isNoContent());
    }
}