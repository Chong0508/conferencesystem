package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Reviewer;
import com.webcrafters.confease_backend.service.ReviewerService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReviewerService reviewerService;

    @InjectMocks
    private ReviewerController reviewerController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewerController).build();
    }

    @Test
    void testGetAllReviewers() throws Exception {
        Reviewer r1 = new Reviewer();
        r1.setReviewer_id(1L);
        r1.setExpertise_area("Machine Learning");

        when(reviewerService.getAll()).thenReturn(Arrays.asList(r1));

        mockMvc.perform(get("/api/reviewers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reviewer_id").value(1))
                .andExpect(jsonPath("$[0].expertise_area").value("Machine Learning"));
    }

    @Test
    void testGetReviewerById_Found() throws Exception {
        Reviewer reviewer = new Reviewer();
        reviewer.setReviewer_id(1L);

        when(reviewerService.getById(1L)).thenReturn(reviewer);

        mockMvc.perform(get("/api/reviewers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewer_id").value(1));
    }

    @Test
    void testGetReviewerById_NotFound() throws Exception {
        when(reviewerService.getById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/reviewers/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateReviewer() throws Exception {
        Reviewer reviewer = new Reviewer();
        reviewer.setExpertise_area("Cybersecurity");
        reviewer.setMax_papers(5);

        when(reviewerService.create(any(Reviewer.class))).thenReturn(reviewer);

        mockMvc.perform(post("/api/reviewers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.expertise_area").value("Cybersecurity"))
                .andExpect(jsonPath("$.max_papers").value(5));
    }

    @Test
    void testUpdateReviewer_Success() throws Exception {
        Reviewer updated = new Reviewer();
        updated.setReviewer_id(1L);
        updated.setExpertise_area("Updated Area");

        when(reviewerService.update(eq(1L), any(Reviewer.class))).thenReturn(updated);

        mockMvc.perform(put("/api/reviewers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expertise_area").value("Updated Area"));
    }

    @Test
    void testDeleteReviewer() throws Exception {
        mockMvc.perform(delete("/api/reviewers/1"))
                .andExpect(status().isNoContent());
    }
}