package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Reviewer;
import com.webcrafters.confease_backend.repository.ReviewerRepository;
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
public class ReviewerServiceTest {

    @Mock
    private ReviewerRepository repository;

    @InjectMocks
    private ReviewerServiceImpl service;

    private Reviewer sampleReviewer;

    @BeforeEach
    void setUp() {
        sampleReviewer = new Reviewer();
        sampleReviewer.setReviewer_id(1L);
        sampleReviewer.setUser_id(101L);
        sampleReviewer.setExpertise_area("Natural Language Processing");
        sampleReviewer.setMax_papers(5);
    }

    @Test
    @DisplayName("Should return all reviewers")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleReviewer));

        List<Reviewer> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Natural Language Processing", result.get(0).getExpertise_area());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find reviewer by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleReviewer));

        Reviewer result = service.getById(1L);

        assertNotNull(result);
        assertEquals(101L, result.getUser_id());
    }

    @Test
    @DisplayName("Should throw exception when reviewer ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new reviewer profile")
    void createTest() {
        when(repository.save(any(Reviewer.class))).thenReturn(sampleReviewer);

        Reviewer saved = service.create(new Reviewer());

        assertNotNull(saved);
        assertEquals(5, saved.getMax_papers());
        verify(repository, times(1)).save(any(Reviewer.class));
    }

    @Test
    @DisplayName("Should update reviewer expertise and workload")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Reviewer.class))).thenReturn(sampleReviewer);

        sampleReviewer.setMax_papers(10);
        Reviewer updated = service.update(1L, sampleReviewer);

        assertNotNull(updated);
        assertEquals(10, updated.getMax_papers());
    }

    @Test
    @DisplayName("Should delete reviewer successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}