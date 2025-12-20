package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
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
class KeywordServiceTest {

    @Mock
    private KeywordRepository repository;

    @InjectMocks
    private KeywordServiceImpl service;

    private Keyword sampleKeyword;

    @BeforeEach
    void setUp() {
        sampleKeyword = new Keyword();
        sampleKeyword.setKeyword_id(1);
        sampleKeyword.setKeyword("Machine Learning");
    }

    @Test
    @DisplayName("Should return all keywords")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleKeyword));

        List<Keyword> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Machine Learning", result.get(0).getKeyword());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find keyword by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1)).thenReturn(Optional.of(sampleKeyword));

        Keyword result = service.getById(1);

        assertNotNull(result);
        assertEquals("Machine Learning", result.getKeyword());
    }

    @Test
    @DisplayName("Should throw exception when keyword ID not found")
    void getByIdFailTest() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99));
        assertTrue(exception.getMessage().contains("Data not found: 99"));
    }

    @Test
    @DisplayName("Should create a new keyword")
    void createTest() {
        when(repository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        Keyword saved = service.create(new Keyword());

        assertNotNull(saved);
        assertEquals("Machine Learning", saved.getKeyword());
        verify(repository, times(1)).save(any(Keyword.class));
    }

    @Test
    @DisplayName("Should update keyword successfully")
    void updateSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);
        when(repository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        Keyword updated = service.update(1, sampleKeyword);

        assertNotNull(updated);
        verify(repository).existsById(1);
        verify(repository).save(sampleKeyword);
    }

    @Test
    @DisplayName("Should delete keyword successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);

        service.delete(1);

        verify(repository, times(1)).deleteById(1);
    }

    @Test
    @DisplayName("Should fail to delete if keyword does not exist")
    void deleteFailTest() {
        when(repository.existsById(1)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> service.delete(1));
        verify(repository, never()).deleteById(anyInt());
    }
}