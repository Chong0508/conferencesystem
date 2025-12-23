package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class KeywordServiceTest {

    @Mock
    private KeywordRepository keywordRepository;

    @InjectMocks
    private KeywordServiceImpl keywordService;

    private Keyword sampleKeyword;

    @BeforeEach
    void setUp() {
        sampleKeyword = new Keyword();
        sampleKeyword.setKeyword_id(1L);
        sampleKeyword.setKeyword("Artificial Intelligence");
    }

    @Test
    void getAll_ShouldReturnList() {
        // Arrange
        when(keywordRepository.findAll()).thenReturn(Arrays.asList(sampleKeyword));

        // Act
        List<Keyword> result = keywordService.getAll();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Artificial Intelligence", result.get(0).getKeyword());
        verify(keywordRepository, times(1)).findAll();
    }

    @Test
    void getById_WhenFound_ShouldReturnKeyword() {
        // Arrange
        when(keywordRepository.findById(1L)).thenReturn(Optional.of(sampleKeyword));

        // Act
        Keyword result = keywordService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getKeyword_id());
        verify(keywordRepository, times(1)).findById(1L);
    }

    @Test
    void getById_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(keywordRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            keywordService.getById(99L);
        });
        
        assertTrue(exception.getMessage().contains("Data not found: 99"));
    }

    @Test
    void create_ShouldSaveAndReturnKeyword() {
        // Arrange
        when(keywordRepository.save(any(Keyword.class))).thenReturn(sampleKeyword);

        // Act
        Keyword result = keywordService.create(new Keyword());

        // Assert
        assertNotNull(result);
        assertEquals("Artificial Intelligence", result.getKeyword());
        verify(keywordRepository, times(1)).save(any(Keyword.class));
    }

    @Test
    void delete_WhenExists_ShouldCallDelete() {
        // Arrange
        when(keywordRepository.existsById(1L)).thenReturn(true);
        doNothing().when(keywordRepository).deleteById(1L);

        // Act
        keywordService.delete(1L);

        // Assert
        verify(keywordRepository, times(1)).deleteById(1L);
    }

    @Test
    void delete_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(keywordRepository.existsById(88L)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> keywordService.delete(88L));
        verify(keywordRepository, never()).deleteById(anyLong());
    }
}