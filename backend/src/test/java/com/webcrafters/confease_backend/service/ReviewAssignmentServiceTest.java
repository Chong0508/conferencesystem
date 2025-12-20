package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ReviewAssignment;
import com.webcrafters.confease_backend.repository.ReviewAssignmentRepository;
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
public class ReviewAssignmentServiceTest {

    @Mock
    private ReviewAssignmentRepository repository;

    @InjectMocks
    private ReviewAssignmentServiceImpl service;

    private ReviewAssignment sampleAssignment;

    @BeforeEach
    void setUp() {
        sampleAssignment = new ReviewAssignment();
        sampleAssignment.setAssignment_id(1L);
        sampleAssignment.setPaper_id(500L);
        sampleAssignment.setReviewer_id(101L);
        sampleAssignment.setAssigned_at(Timestamp.from(Instant.now()));
        sampleAssignment.setDue_date(Date.valueOf(LocalDate.now().plusDays(14)));
        sampleAssignment.setStatus("ASSIGNED");
    }

    @Test
    @DisplayName("Should return all review assignments")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleAssignment));

        List<ReviewAssignment> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("ASSIGNED", result.get(0).getStatus());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find assignment by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleAssignment));

        ReviewAssignment result = service.getById(1L);

        assertNotNull(result);
        assertEquals(500L, result.getPaper_id());
    }

    @Test
    @DisplayName("Should throw exception when assignment ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new review assignment")
    void createTest() {
        when(repository.save(any(ReviewAssignment.class))).thenReturn(sampleAssignment);

        ReviewAssignment saved = service.create(new ReviewAssignment());

        assertNotNull(saved);
        assertEquals(101L, saved.getReviewer_id());
        verify(repository, times(1)).save(any(ReviewAssignment.class));
    }

    @Test
    @DisplayName("Should update assignment status")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(ReviewAssignment.class))).thenReturn(sampleAssignment);

        sampleAssignment.setStatus("UNDER_REVIEW");
        ReviewAssignment updated = service.update(1L, sampleAssignment);

        assertNotNull(updated);
        assertEquals("UNDER_REVIEW", updated.getStatus());
    }

    @Test
    @DisplayName("Should delete assignment successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}