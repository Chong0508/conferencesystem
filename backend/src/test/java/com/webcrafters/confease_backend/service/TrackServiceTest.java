package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Track;
import com.webcrafters.confease_backend.repository.TrackRepository;
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
public class TrackServiceTest {

    @Mock
    private TrackRepository repository;

    @InjectMocks
    private TrackServiceImpl service;

    private Track sampleTrack;

    @BeforeEach
    void setUp() {
        sampleTrack = new Track();
        sampleTrack.setTrack_id(1L);
        sampleTrack.setConference_id(10L);
        sampleTrack.setName("Software Engineering");
        sampleTrack.setChair_id(5L);
        sampleTrack.setDescription("Research related to software lifecycles and tools.");
    }

    @Test
    @DisplayName("Should return all tracks")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleTrack));
        List<Track> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals("Software Engineering", result.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find track by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleTrack));
        Track result = service.getById(1L);
        assertNotNull(result);
        assertEquals(5L, result.getChair_id());
    }

    @Test
    @DisplayName("Should throw exception when track ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new track")
    void createTest() {
        when(repository.save(any(Track.class))).thenReturn(sampleTrack);
        Track saved = service.create(new Track());
        assertNotNull(saved);
        assertEquals("Software Engineering", saved.getName());
        verify(repository, times(1)).save(any(Track.class));
    }

    @Test
    @DisplayName("Should update track details (e.g., change chair)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Track.class))).thenReturn(sampleTrack);

        sampleTrack.setChair_id(12L);
        Track updated = service.update(1L, sampleTrack);

        assertNotNull(updated);
        assertEquals(12L, updated.getChair_id());
    }

    @Test
    @DisplayName("Should delete track successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }
}