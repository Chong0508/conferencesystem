package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
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
public class PaperServiceTest {

    @Mock
    private PaperRepository repository;

    @InjectMocks
    private PaperServiceImpl service;

    private Paper samplePaper;

    @BeforeEach
    void setUp() {
        samplePaper = new Paper();
        samplePaper.setPaper_id(1L);
        samplePaper.setTitle("Advancements in AI");
        samplePaper.setAbstractText("This paper explores...");
        samplePaper.setStatus("SUBMITTED");
        samplePaper.setVersion(1);
        samplePaper.setPlagiarism_score(0.05);
        samplePaper.setSubmitted_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all papers")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(samplePaper));
        List<Paper> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals("Advancements in AI", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Should find paper by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(samplePaper));
        Paper result = service.getById(1L);
        assertNotNull(result);
        assertEquals("SUBMITTED", result.getStatus());
    }

    @Test
    @DisplayName("Should throw exception when paper ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new paper submission")
    void createTest() {
        when(repository.save(any(Paper.class))).thenReturn(samplePaper);
        Paper saved = service.create(new Paper());
        assertNotNull(saved);
        assertEquals(0.05, saved.getPlagiarism_score());
        verify(repository, times(1)).save(any(Paper.class));
    }

    @Test
    @DisplayName("Should update paper (e.g., status change)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Paper.class))).thenReturn(samplePaper);

        samplePaper.setStatus("UNDER_REVIEW");
        Paper updated = service.update(1L, samplePaper);

        assertNotNull(updated);
        assertEquals("UNDER_REVIEW", updated.getStatus());
    }

    @Test
    @DisplayName("Should delete paper successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }
}