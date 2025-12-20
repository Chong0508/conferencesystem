package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.model.ReviewScoreId;
import com.webcrafters.confease_backend.repository.ReviewScoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewScoreServiceTest {

    @Mock
    private ReviewScoreRepository repository;

    @InjectMocks
    private ReviewScoreServiceImpl service;

    private ReviewScore sampleScore;
    private ReviewScoreId sampleId;

    @BeforeEach
    void setUp() {
        sampleId = new ReviewScoreId();
        sampleId.setReview_id(500L);
        sampleId.setCriterion_id(1);

        sampleScore = new ReviewScore();
        sampleScore.setReview_id(500L);
        sampleScore.setCriterion_id(1);
        sampleScore.setScore(4.5);
    }

    @Test
    @DisplayName("Should return all granular review scores")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleScore));

        List<ReviewScore> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(4.5, result.get(0).getScore());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find specific score by composite ID")
    void getByIdSuccessTest() {
        when(repository.findById(any(ReviewScoreId.class))).thenReturn(Optional.of(sampleScore));

        ReviewScore result = service.getById(sampleId);

        assertNotNull(result);
        assertEquals(1, result.getCriterion_id());
    }

    @Test
    @DisplayName("Should throw exception when specific score ID not found")
    void getByIdFailTest() {
        when(repository.findById(any(ReviewScoreId.class))).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(sampleId));
    }

    @Test
    @DisplayName("Should save a new granular score")
    void createTest() {
        when(repository.save(any(ReviewScore.class))).thenReturn(sampleScore);

        ReviewScore saved = service.create(new ReviewScore());

        assertNotNull(saved);
        assertEquals(4.5, saved.getScore());
        verify(repository, times(1)).save(any(ReviewScore.class));
    }

    @Test
    @DisplayName("Should update an existing score")
    void updateSuccessTest() {
        when(repository.existsById(any(ReviewScoreId.class))).thenReturn(true);
        when(repository.save(any(ReviewScore.class))).thenReturn(sampleScore);

        sampleScore.setScore(5.0);
        ReviewScore updated = service.update(sampleId, sampleScore);

        assertNotNull(updated);
        assertEquals(5.0, updated.getScore());
    }

    @Test
    @DisplayName("Should delete a score mapping successfully")
    void deleteSuccessTest() {
        when(repository.existsById(any(ReviewScoreId.class))).thenReturn(true);

        service.delete(sampleId);

        verify(repository, times(1)).deleteById(sampleId);
    }
}