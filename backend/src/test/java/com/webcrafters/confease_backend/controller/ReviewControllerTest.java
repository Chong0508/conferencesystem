package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Review;
import com.webcrafters.confease_backend.repository.ReviewRepository;
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

class ReviewControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewController reviewController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();
    }

    @Test
    void testGetAllReviews() throws Exception {
        Review r1 = new Review();
        r1.setReview_id(1L);
        r1.setRecommendation("Accept");

        when(reviewRepository.findAll()).thenReturn(Arrays.asList(r1));

        mockMvc.perform(get("/api/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].review_id").value(1))
                .andExpect(jsonPath("$[0].recommendation").value("Accept"));
    }

    @Test
    void testGetReviewById_Found() throws Exception {
        Review review = new Review();
        review.setReview_id(1L);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        mockMvc.perform(get("/api/reviews/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.review_id").value(1));
    }

    @Test
    void testGetReviewById_NotFound() throws Exception {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/reviews/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateReview() throws Exception {
        Review review = new Review();
        review.setOverall_score(4.5);
        review.setRecommendation("Strong Accept");

        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        mockMvc.perform(post("/api/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(review)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.overall_score").value(4.5))
                .andExpect(jsonPath("$.recommendation").value("Strong Accept"));
    }

    @Test
    void testUpdateReview_Success() throws Exception {
        Review existing = new Review();
        existing.setReview_id(1L);
        
        Review updatedDetails = new Review();
        updatedDetails.setOverall_score(3.0);
        updatedDetails.setRecommendation("Weak Accept");

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(reviewRepository.save(any(Review.class))).thenReturn(existing);

        mockMvc.perform(put("/api/reviews/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overall_score").value(3.0))
                .andExpect(jsonPath("$.recommendation").value("Weak Accept"));
    }

    @Test
    void testDeleteReview_Success() throws Exception {
        when(reviewRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/reviews/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteReview_NotFound() throws Exception {
        when(reviewRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/reviews/1"))
                .andExpect(status().isNotFound());
    }
}