package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ScoreCriterion;
import com.webcrafters.confease_backend.repository.ScoreCriterionRepository;
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
public class ScoreCriterionServiceTest {

    @Mock
    private ScoreCriterionRepository repository;

    @InjectMocks
    private ScoreCriterionServiceImpl service;

    private ScoreCriterion sampleCriterion;

    @BeforeEach
    void setUp() {
        sampleCriterion = new ScoreCriterion();
        sampleCriterion.setCriterion_id(1);
        sampleCriterion.setName("Originality");
        sampleCriterion.setDescription("The uniqueness and novelty of the research.");
    }

    @Test
    @DisplayName("Should return all criteria")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleCriterion));
        List<ScoreCriterion> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals("Originality", result.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find criterion by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1)).thenReturn(Optional.of(sampleCriterion));
        ScoreCriterion result = service.getById(1);
        assertNotNull(result);
        assertEquals("Originality", result.getName());
    }

    @Test
    @DisplayName("Should throw exception when criterion ID not found")
    void getByIdFailTest() {
        when(repository.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99));
    }

    @Test
    @DisplayName("Should create a new scoring criterion")
    void createTest() {
        when(repository.save(any(ScoreCriterion.class))).thenReturn(sampleCriterion);
        ScoreCriterion saved = service.create(new ScoreCriterion());
        assertNotNull(saved);
        assertEquals("Originality", saved.getName());
        verify(repository, times(1)).save(any(ScoreCriterion.class));
    }

    @Test
    @DisplayName("Should update criterion details")
    void updateSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);
        when(repository.save(any(ScoreCriterion.class))).thenReturn(sampleCriterion);

        sampleCriterion.setDescription("Updated description for clarity.");
        ScoreCriterion updated = service.update(1, sampleCriterion);

        assertNotNull(updated);
        assertEquals("Updated description for clarity.", updated.getDescription());
    }

    @Test
    @DisplayName("Should delete criterion successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);
        service.delete(1);
        verify(repository, times(1)).deleteById(1);
    }
}