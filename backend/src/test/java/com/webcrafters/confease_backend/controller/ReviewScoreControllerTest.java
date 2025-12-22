package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.model.ReviewScoreId;
import com.webcrafters.confease_backend.service.ReviewScoreService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewScoreControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReviewScoreService reviewScoreService;

    @InjectMocks
    private ReviewScoreController reviewScoreController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewScoreController).build();
    }

    @Test
    void testGetAllReviewScores() throws Exception {
        ReviewScore score = new ReviewScore();
        score.setReview_id(1L);
        score.setCriterion_id(10);
        score.setScore(4.5);

        when(reviewScoreService.getAll()).thenReturn(Arrays.asList(score));

        mockMvc.perform(get("/api/review-scores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].review_id").value(1))
                .andExpect(jsonPath("$[0].score").value(4.5));
    }

    @Test
    void testGetReviewScoreById_Found() throws Exception {
        ReviewScore score = new ReviewScore();
        score.setReview_id(1L);
        score.setCriterion_id(10);
        score.setScore(5.0);

        when(reviewScoreService.getById(any(ReviewScoreId.class))).thenReturn(score);

        mockMvc.perform(get("/api/review-scores/1/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(5.0));
    }

    @Test
    void testGetReviewScoreById_NotFound() throws Exception {
        when(reviewScoreService.getById(any(ReviewScoreId.class))).thenThrow(new RuntimeException("Not Found"));

        mockMvc.perform(get("/api/review-scores/1/10"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateReviewScore() throws Exception {
        ReviewScore score = new ReviewScore();
        score.setReview_id(2L);
        score.setCriterion_id(5);
        score.setScore(3.5);

        when(reviewScoreService.create(any(ReviewScore.class))).thenReturn(score);

        mockMvc.perform(post("/api/review-scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(score)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.score").value(3.5));
    }

    @Test
    void testUpdateReviewScore_Success() throws Exception {
        ReviewScore updated = new ReviewScore();
        updated.setScore(4.0);

        when(reviewScoreService.update(any(ReviewScoreId.class), any(ReviewScore.class))).thenReturn(updated);

        mockMvc.perform(put("/api/review-scores/1/10")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(4.0));
    }

    @Test
    void testDeleteReviewScore() throws Exception {
        doNothing().when(reviewScoreService).delete(any(ReviewScoreId.class));

        mockMvc.perform(delete("/api/review-scores/1/10"))
                .andExpect(status().isNoContent());

        verify(reviewScoreService, times(1)).delete(any(ReviewScoreId.class));
    }
}