package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
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

public class PaperKeywordControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaperKeywordRepository paperKeywordRepository;

    @InjectMocks
    private PaperKeywordController paperKeywordController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paperKeywordController).build();
    }

    @Test
    void shouldGetAllPaperKeywords() throws Exception {
        PaperKeyword pk = new PaperKeyword();
        pk.setPaper_id(1L);
        pk.setKeyword_id(101);

        when(paperKeywordRepository.findAll()).thenReturn(Arrays.asList(pk));

        mockMvc.perform(get("/api/paper-keywords"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].paper_id").value(1))
                .andExpect(jsonPath("$[0].keyword_id").value(101));
    }

    @Test
    void shouldGetPaperKeywordById_Found() throws Exception {
        PaperKeyword pk = new PaperKeyword();
        pk.setPaper_id(1L);
        pk.setKeyword_id(101);

        // Mocking the findById which takes a PaperKeywordId object
        when(paperKeywordRepository.findById(any(PaperKeywordId.class)))
                .thenReturn(Optional.of(pk));

        mockMvc.perform(get("/api/paper-keywords/1/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paper_id").value(1))
                .andExpect(jsonPath("$.keyword_id").value(101));
    }

    @Test
    void shouldGetPaperKeywordById_NotFound() throws Exception {
        when(paperKeywordRepository.findById(any(PaperKeywordId.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/paper-keywords/1/101"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreatePaperKeyword() throws Exception {
        PaperKeyword pk = new PaperKeyword();
        pk.setPaper_id(2L);
        pk.setKeyword_id(202);

        when(paperKeywordRepository.save(any(PaperKeyword.class))).thenReturn(pk);

        mockMvc.perform(post("/api/paper-keywords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pk)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paper_id").value(2))
                .andExpect(jsonPath("$.keyword_id").value(202));
    }

    @Test
    void shouldDeletePaperKeyword_Success() throws Exception {
        when(paperKeywordRepository.existsById(any(PaperKeywordId.class))).thenReturn(true);

        mockMvc.perform(delete("/api/paper-keywords/1/101"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldDeletePaperKeyword_NotFound() throws Exception {
        when(paperKeywordRepository.existsById(any(PaperKeywordId.class))).thenReturn(false);

        mockMvc.perform(delete("/api/paper-keywords/1/101"))
                .andExpect(status().isNotFound());
    }
}