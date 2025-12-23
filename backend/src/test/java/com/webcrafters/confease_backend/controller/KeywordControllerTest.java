package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
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
        sampleKeyword.setKeyword_id(1L); 
        sampleKeyword.setKeyword("Machine Learning");
    }

    @Test
    void getAllKeywords_ShouldReturnList() throws Exception {
        when(keywordRepository.findAll()).thenReturn(Arrays.asList(sampleKeyword));

        mockMvc.perform(get("/api/keywords"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].keyword").value("Machine Learning"));
    }

    @Test
    void getKeywordById_WhenFound_ShouldReturnKeyword() throws Exception {
        when(keywordRepository.findById(1L)).thenReturn(Optional.of(sampleKeyword));

        mockMvc.perform(get("/api/keywords/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keyword").value("Machine Learning"));
    }

    @Test
    void getKeywordById_WhenNotFound_ShouldReturn404() throws Exception {
        when(keywordRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/keywords/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createKeyword_ShouldReturnCreatedStatus() throws Exception {
        when(keywordRepository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        mockMvc.perform(post("/api/keywords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleKeyword)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.keyword").value("Machine Learning"));
    }

    @Test
    void updateKeyword_WhenExists_ShouldReturnUpdatedKeyword() throws Exception {
        when(keywordRepository.findById(1L)).thenReturn(Optional.of(sampleKeyword));
        when(keywordRepository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        Keyword updateInfo = new Keyword();
        updateInfo.setKeyword("Deep Learning");

        mockMvc.perform(put("/api/keywords/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keyword").value("Deep Learning"));
    }

    @Test
    void deleteKeyword_WhenExists_ShouldReturnNoContent() throws Exception {
        when(keywordRepository.existsById(1L)).thenReturn(true);
        doNothing().when(keywordRepository).deleteById(1L);

        mockMvc.perform(delete("/api/keywords/1"))
                .andExpect(status().isNoContent());

        verify(keywordRepository, times(1)).deleteById(1L);
    }
}