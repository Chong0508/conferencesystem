package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Rebuttal;
import com.webcrafters.confease_backend.repository.RebuttalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RebuttalServiceTest {

    @Mock
    private RebuttalRepository repository;

    @InjectMocks
    private RebuttalServiceImpl service;

    private Rebuttal sampleRebuttal;

    @BeforeEach
    void setUp() {
        sampleRebuttal = new Rebuttal();
        sampleRebuttal.setRebuttal_id(1L);
        sampleRebuttal.setPaper_id(500L);
        sampleRebuttal.setAuthor_id(10L);
        sampleRebuttal.setReview_round(1);
        sampleRebuttal.setContent("We have addressed the concerns regarding the methodology...");
        sampleRebuttal.setSubmitted_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all rebuttals")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleRebuttal));

        List<Rebuttal> result = service.getAll();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getContent().contains("methodology"));
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find rebuttal by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleRebuttal));

        Rebuttal result = service.getById(1L);

        assertNotNull(result);
        assertEquals(500L, result.getPaper_id());
    }

    @Test
    @DisplayName("Should throw exception when rebuttal ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new rebuttal")
    void createTest() {
        when(repository.save(any(Rebuttal.class))).thenReturn(sampleRebuttal);

        Rebuttal saved = service.create(new Rebuttal());

        assertNotNull(saved);
        assertEquals(1, saved.getReview_round());
        verify(repository, times(1)).save(any(Rebuttal.class));
    }

    @Test
    @DisplayName("Should update rebuttal content")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Rebuttal.class))).thenReturn(sampleRebuttal);

        sampleRebuttal.setContent("Updated content for round 1");
        Rebuttal updated = service.update(1L, sampleRebuttal);

        assertNotNull(updated);
        assertEquals("Updated content for round 1", updated.getContent());
    }

    @Test
    @DisplayName("Should delete rebuttal successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}