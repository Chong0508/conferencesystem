package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
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
public class PaperKeywordServiceTest {

    @Mock
    private PaperKeywordRepository repository;

    @InjectMocks
    private PaperKeywordServiceImpl service;

    private PaperKeyword sampleMapping;
    private PaperKeywordId sampleId;

    @BeforeEach
    void setUp() {
        sampleId = new PaperKeywordId();
        sampleId.setPaper_id(100L);
        sampleId.setKeyword_id(5);

        sampleMapping = new PaperKeyword();
        sampleMapping.setPaper_id(100L);
        sampleMapping.setKeyword_id(5);
    }

    @Test
    @DisplayName("Should return all paper-keyword mappings")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleMapping));

        List<PaperKeyword> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getKeyword_id());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find mapping by composite ID")
    void getByIdSuccessTest() {
        when(repository.findById(any(PaperKeywordId.class))).thenReturn(Optional.of(sampleMapping));

        PaperKeyword result = service.getById(sampleId);

        assertNotNull(result);
        assertEquals(100L, result.getPaper_id());
    }

    @Test
    @DisplayName("Should throw exception when composite ID not found")
    void getByIdFailTest() {
        when(repository.findById(any(PaperKeywordId.class))).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(sampleId));
    }

    @Test
    @DisplayName("Should create a new mapping")
    void createTest() {
        when(repository.save(any(PaperKeyword.class))).thenReturn(sampleMapping);

        PaperKeyword saved = service.create(new PaperKeyword());

        assertNotNull(saved);
        assertEquals(5, saved.getKeyword_id());
        verify(repository, times(1)).save(any(PaperKeyword.class));
    }

    @Test
    @DisplayName("Should delete mapping successfully")
    void deleteSuccessTest() {
        when(repository.existsById(any(PaperKeywordId.class))).thenReturn(true);

        service.delete(sampleId);

        verify(repository, times(1)).deleteById(sampleId);
    }
}