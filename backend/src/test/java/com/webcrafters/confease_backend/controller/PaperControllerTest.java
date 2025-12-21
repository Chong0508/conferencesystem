package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
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

public class PaperControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaperRepository paperRepository;

    @InjectMocks
    private PaperController paperController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paperController).build();
        
        // Setup ObjectMapper to handle LocalDateTime
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void shouldGetAllPapers() throws Exception {
        Paper p1 = new Paper();
        p1.setTitle("Study A");
        Paper p2 = new Paper();
        p2.setTitle("Study B");

        when(paperRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        mockMvc.perform(get("/api/papers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Study A"));
    }

    @Test
    void shouldGetPapersByAuthor() throws Exception {
        Paper p1 = new Paper();
        p1.setSubmittedBy(1L);
        p1.setTitle("Author's Work");

        when(paperRepository.findBySubmittedBy(1L)).thenReturn(Arrays.asList(p1));

        mockMvc.perform(get("/api/papers/author/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Author's Work"));
    }

    @Test
    void shouldCreatePaper() throws Exception {
        Paper inputPaper = new Paper();
        inputPaper.setTitle("New Tech");
        inputPaper.setAbstractText("This is a summary.");

        Paper savedPaper = new Paper();
        savedPaper.setPaperId(99L);
        savedPaper.setTitle("New Tech");

        when(paperRepository.save(any(Paper.class))).thenReturn(savedPaper);

        mockMvc.perform(post("/api/papers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputPaper)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Paper submitted successfully"))
                .andExpect(jsonPath("$.paperId").value(99));
    }

    @Test
    void shouldUpdatePaper() throws Exception {
        Paper existing = new Paper();
        existing.setPaperId(1L);
        existing.setTitle("Old Title");

        Paper updatedDetails = new Paper();
        updatedDetails.setTitle("Updated Title");

        when(paperRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(paperRepository.save(any(Paper.class))).thenReturn(existing);

        mockMvc.perform(put("/api/papers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldDeletePaper() throws Exception {
        when(paperRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/papers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenPaperNotFound() throws Exception {
        when(paperRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/papers/1"))
                .andExpect(status().isNotFound());
    }
}