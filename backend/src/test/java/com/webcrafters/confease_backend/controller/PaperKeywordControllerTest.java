package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaperKeywordController.class)
public class PaperKeywordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaperKeywordRepository paperKeywordRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private PaperKeyword samplePaperKeyword;

    @BeforeEach
    void setUp() {
        samplePaperKeyword = new PaperKeyword();
        // FIX: Use 1L instead of 1 to match the Long type requirement
        samplePaperKeyword.setPaper_id(1L);
        samplePaperKeyword.setKeyword_id(1L);
    }

    @Test
    void getAllPaperKeywords_ShouldReturnList() throws Exception {
        when(paperKeywordRepository.findAll()).thenReturn(Arrays.asList(samplePaperKeyword));

        mockMvc.perform(get("/api/paper-keywords"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].paper_id").value(1));
    }

    @Test
    void createPaperKeyword_ShouldReturnCreated() throws Exception {
        when(paperKeywordRepository.save(any(PaperKeyword.class))).thenReturn(samplePaperKeyword);

        mockMvc.perform(post("/api/paper-keywords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(samplePaperKeyword)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paper_id").value(1));
    }

    @Test
    void deletePaperKeyword_WhenExists_ShouldReturnNoContent() throws Exception {
        // We use any() here because the controller creates a new PaperKeywordId object internally
        when(paperKeywordRepository.existsById(any(PaperKeywordId.class))).thenReturn(true);
        doNothing().when(paperKeywordRepository).deleteById(any(PaperKeywordId.class));

        mockMvc.perform(delete("/api/paper-keywords/1/1"))
                .andExpect(status().isNoContent());
    }
}