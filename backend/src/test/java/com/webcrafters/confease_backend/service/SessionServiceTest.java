package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Session;
import com.webcrafters.confease_backend.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository repository;

    @InjectMocks
    private SessionServiceImpl service;

    private Session sampleSession;

    @BeforeEach
    void setUp() {
        Instant now = Instant.now();
        sampleSession = new Session();
        sampleSession.setSession_id(1L);
        sampleSession.setEvent_id(101L);
        sampleSession.setTitle("Future of Quantum Computing");
        sampleSession.setChair_id(50L);
        sampleSession.setSpeaker_name("Dr. Alice Smith");
        sampleSession.setSession_type("KEYNOTE");
        sampleSession.setVenue("Hall B");
        sampleSession.setStart_time(Timestamp.from(now));
        sampleSession.setEnd_time(Timestamp.from(now.plus(90, ChronoUnit.MINUTES)));
    }

    @Test
    @DisplayName("Should return all sessions")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleSession));
        List<Session> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals("Dr. Alice Smith", result.get(0).getSpeaker_name());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find session by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleSession));
        Session result = service.getById(1L);
        assertNotNull(result);
        assertEquals("KEYNOTE", result.getSession_type());
    }

    @Test
    @DisplayName("Should throw exception when session ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new session")
    void createTest() {
        when(repository.save(any(Session.class))).thenReturn(sampleSession);
        Session saved = service.create(new Session());
        assertNotNull(saved);
        assertEquals("Future of Quantum Computing", saved.getTitle());
        verify(repository, times(1)).save(any(Session.class));
    }

    @Test
    @DisplayName("Should update session details (e.g., change speaker)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Session.class))).thenReturn(sampleSession);

        sampleSession.setSpeaker_name("Dr. Bob Jones");
        Session updated = service.update(1L, sampleSession);

        assertNotNull(updated);
        assertEquals("Dr. Bob Jones", updated.getSpeaker_name());
    }

    @Test
    @DisplayName("Should delete session successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }
}