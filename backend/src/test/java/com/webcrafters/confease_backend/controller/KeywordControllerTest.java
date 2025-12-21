package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KeywordController.class)
public class KeywordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean 
    private KeywordRepository keywordRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Keyword sampleKeyword;

    @BeforeEach
    void setUp() {
        sampleKeyword = new Keyword();
        sampleKeyword.setKeyword_id(1);
        sampleKeyword.setKeyword("Machine Learning");
    }

    @Test
    @DisplayName("GET /api/keywords - Success")
    void getAllKeywords_ReturnsList() throws Exception {
        when(keywordRepository.findAll()).thenReturn(List.of(sampleKeyword));

        mockMvc.perform(get("/api/keywords"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].keyword").value("Machine Learning"))
                .andExpect(jsonPath("$[0].keyword_id").value(1));
    }

    @Test
    @DisplayName("GET /api/keywords/{id} - Found")
    void getKeywordById_Found_ReturnsKeyword() throws Exception {
        when(keywordRepository.findById(1)).thenReturn(Optional.of(sampleKeyword));

        mockMvc.perform(get("/api/keywords/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keyword").value("Machine Learning"));
    }

    @Test
    @DisplayName("GET /api/keywords/{id} - Not Found")
    void getKeywordById_NotFound_Returns404() throws Exception {
        when(keywordRepository.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/keywords/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/keywords - Created")
    void createKeyword_Returns201() throws Exception {
        when(keywordRepository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        mockMvc.perform(post("/api/keywords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleKeyword)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.keyword").value("Machine Learning"));
    }

    @Test
    @DisplayName("PUT /api/keywords/{id} - Success")
    void updateKeyword_ValidId_ReturnsUpdated() throws Exception {
        when(keywordRepository.findById(1)).thenReturn(Optional.of(sampleKeyword));
        when(keywordRepository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        mockMvc.perform(put("/api/keywords/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleKeyword)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keyword").value("Machine Learning"));
    }

    @Test
    @DisplayName("DELETE /api/keywords/{id} - Success")
    void deleteKeyword_ValidId_Returns204() throws Exception {
        when(keywordRepository.existsById(1)).thenReturn(true);

        mockMvc.perform(delete("/api/keywords/1"))
                .andExpect(status().isNoContent());
    }
}