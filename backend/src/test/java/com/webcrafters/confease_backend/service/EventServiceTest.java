package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Event;
import com.webcrafters.confease_backend.repository.EventRepository;
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
public class EventServiceTest {

    @Mock
    private EventRepository repository;

    @InjectMocks
    private EventServiceImpl service;

    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        sampleEvent = new Event();
        sampleEvent.setEvent_id(1L);
        sampleEvent.setConference_id(10L);
        sampleEvent.setName("Opening Keynote");
        sampleEvent.setLocation("Grand Ballroom");
        sampleEvent.setStart_time(Timestamp.from(Instant.now()));
        sampleEvent.setEnd_time(Timestamp.from(Instant.now().plusSeconds(3600))); // 1 hour later
    }

    @Test
    @DisplayName("Should return all events")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleEvent));

        List<Event> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Opening Keynote", result.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find event by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        Event result = service.getById(1L);

        assertNotNull(result);
        assertEquals("Grand Ballroom", result.getLocation());
    }

    @Test
    @DisplayName("Should throw exception when event ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99L));
        assertTrue(exception.getMessage().contains("Data not found: 99"));
    }

    @Test
    @DisplayName("Should create a new event")
    void createTest() {
        when(repository.save(any(Event.class))).thenReturn(sampleEvent);

        Event saved = service.create(new Event());

        assertNotNull(saved);
        assertEquals("Opening Keynote", saved.getName());
        verify(repository, times(1)).save(any(Event.class));
    }

    @Test
    @DisplayName("Should update event successfully")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Event.class))).thenReturn(sampleEvent);

        Event updated = service.update(1L, sampleEvent);

        assertNotNull(updated);
        verify(repository).existsById(1L);
        verify(repository).save(sampleEvent);
    }

    @Test
    @DisplayName("Should delete event successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should fail to delete if event does not exist")
    void deleteFailTest() {
        when(repository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> service.delete(1L));
        verify(repository, never()).deleteById(anyLong());
    }
}