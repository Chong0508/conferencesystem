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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaperServiceTest {

    @Mock
    private PaperRepository paperRepository;

    @InjectMocks
    private PaperServiceImpl paperService;

    private Paper samplePaper;

    @BeforeEach
    void setUp() {
        samplePaper = new Paper();
        samplePaper.setPaperId(1L);
        samplePaper.setTitle("Modern AI Research");
        samplePaper.setAbstractText("This is a study on AI trends...");
        samplePaper.setStatus("SUBMITTED");
        samplePaper.setSubmittedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should return all papers")
    void getAll_ReturnsList() {
        // Arrange
        when(paperRepository.findAll()).thenReturn(List.of(samplePaper));

        // Act
        List<Paper> result = paperService.getAll();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Modern AI Research");
        verify(paperRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return paper when valid ID is provided")
    void getById_ValidId_ReturnsPaper() {
        // Arrange
        when(paperRepository.findById(1L)).thenReturn(Optional.of(samplePaper));

        // Act
        Paper foundPaper = paperService.getById(1L);

        // Assert
        assertThat(foundPaper).isNotNull();
        assertThat(foundPaper.getPaperId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should throw exception when paper ID does not exist")
    void getById_InvalidId_ThrowsException() {
        // Arrange
        when(paperRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paperService.getById(99L);
        });
        
        assertThat(exception.getMessage()).contains("Data not found: 99");
    }

    @Test
    @DisplayName("Should save a new paper successfully")
    void create_SavesPaper() {
        // Arrange
        when(paperRepository.save(any(Paper.class))).thenReturn(samplePaper);

        // Act
        Paper savedPaper = paperService.create(new Paper());

        // Assert
        assertThat(savedPaper).isNotNull();
        assertThat(savedPaper.getTitle()).isEqualTo("Modern AI Research");
        verify(paperRepository, times(1)).save(any(Paper.class));
    }

    @Test
    @DisplayName("Should update existing paper successfully")
    void update_ExistingId_UpdatesPaper() {
        // Arrange
        when(paperRepository.existsById(1L)).thenReturn(true);
        when(paperRepository.save(any(Paper.class))).thenReturn(samplePaper);

        // Act
        Paper updatedPaper = paperService.update(1L, samplePaper);

        // Assert
        assertThat(updatedPaper).isNotNull();
        verify(paperRepository).existsById(1L);
        verify(paperRepository).save(samplePaper);
    }

    @Test
    @DisplayName("Should delete paper when ID exists")
    void delete_ExistingId_DeletesPaper() {
        // Arrange
        when(paperRepository.existsById(1L)).thenReturn(true);
        doNothing().when(paperRepository).deleteById(1L);

        // Act
        paperService.delete(1L);

        // Assert
        verify(paperRepository, times(1)).deleteById(1L);
    }
}