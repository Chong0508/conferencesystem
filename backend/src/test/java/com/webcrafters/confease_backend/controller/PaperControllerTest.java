package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaperController.class)
public class PaperControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaperRepository paperRepository;

    @Autowired
    private ObjectMapper objectMapper; // Used to convert Objects to JSON strings

    private Paper samplePaper;

    @BeforeEach
    void setUp() {
        samplePaper = new Paper();
        samplePaper.setPaperId(1L);
        samplePaper.setTitle("Initial Research");
        samplePaper.setSubmittedBy(101L);
        samplePaper.setStatus("Pending Review");
    }

    // --- 1. GET ALL PAPERS ---
    @Test
    void getAllPapers_ShouldReturnList() throws Exception {
        when(paperRepository.findAll()).thenReturn(Arrays.asList(samplePaper));

        mockMvc.perform(get("/api/papers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Initial Research"));
    }

    // --- 2. GET PAPERS BY AUTHOR ---
    @Test
    void getPapersByAuthor_ShouldReturnAuthorPapers() throws Exception {
        // Arrange: Create mock data matching your model
        Paper paper = new Paper();
        paper.setPaperId(1L);
        paper.setTitle("Initial Research");
        paper.setSubmittedBy(101L); // In Java it is submittedBy, but JSON will be authorId

        // Mock the repository behavior
        when(paperRepository.findBySubmittedBy(101L)).thenReturn(Arrays.asList(paper));

        // Act & Assert
        mockMvc.perform(get("/api/papers/author/101"))
                .andExpect(status().isOk())
                // FIX: Change 'submittedBy' to 'authorId' to match @JsonProperty("authorId")
                .andExpect(jsonPath("$[0].authorId").value(101)); 
    }

    // --- 3. CREATE PAPER (POST) ---
    @Test
    void createPaper_ShouldReturnCreatedStatus() throws Exception {
        when(paperRepository.save(ArgumentMatchers.any(Paper.class))).thenReturn(samplePaper);

        mockMvc.perform(post("/api/papers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(samplePaper)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Paper submitted successfully"))
                .andExpect(jsonPath("$.paperId").value(1));
    }

    // --- 4. UPDATE PAPER (PUT) ---
    @Test
    void updatePaper_ShouldReturnUpdatedPaper() throws Exception {
        when(paperRepository.findById(1L)).thenReturn(Optional.of(samplePaper));
        when(paperRepository.save(ArgumentMatchers.any(Paper.class))).thenReturn(samplePaper);

        samplePaper.setTitle("Updated Title");

        mockMvc.perform(put("/api/papers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(samplePaper)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    // --- 5. DELETE PAPER ---
    @Test
    void deletePaper_ShouldReturnNoContent() throws Exception {
        when(paperRepository.existsById(1L)).thenReturn(true);
        doNothing().when(paperRepository).deleteById(1L);

        mockMvc.perform(delete("/api/papers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletePaper_ShouldReturnNotFoundIfMissing() throws Exception {
        when(paperRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/papers/99"))
                .andExpect(status().isNotFound());
    }
}