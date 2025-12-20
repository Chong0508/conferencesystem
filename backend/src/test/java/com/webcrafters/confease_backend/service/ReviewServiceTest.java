package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Review;
import com.webcrafters.confease_backend.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository repository;

    @InjectMocks
    private ReviewServiceImpl service;

    private Review sampleReview;

    @BeforeEach
    void setUp() {
        sampleReview = new Review();
        sampleReview.setReview_id(1L);
        sampleReview.setAssignment_id(50L);
        sampleReview.setReviewer_id(101L);
        sampleReview.setOverall_score(4.5);
        sampleReview.setComments_to_author("Excellent work on the results section.");
        sampleReview.setComments_to_chair("Strong accept, but watch the methodology.");
        sampleReview.setRecommendation("ACCEPT");
        sampleReview.setRound_number(1);
        sampleReview.setDue_date(Date.valueOf(LocalDate.now().plusDays(7)));
        sampleReview.setReviewed_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all reviews")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleReview));

        List<Review> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("ACCEPT", result.get(0).getRecommendation());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find review by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleReview));

        Review result = service.getById(1L);

        assertNotNull(result);
        assertEquals(4.5, result.getOverall_score());
    }

    @Test
    @DisplayName("Should throw exception when review ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new review")
    void createTest() {
        when(repository.save(any(Review.class))).thenReturn(sampleReview);

        Review saved = service.create(new Review());

        assertNotNull(saved);
        assertEquals(101L, saved.getReviewer_id());
        verify(repository, times(1)).save(any(Review.class));
    }

    @Test
    @DisplayName("Should update review (e.g., modifying score)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Review.class))).thenReturn(sampleReview);

        sampleReview.setOverall_score(5.0);
        Review updated = service.update(1L, sampleReview);

        assertNotNull(updated);
        assertEquals(5.0, updated.getOverall_score());
    }

    @Test
    @DisplayName("Should delete review successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}