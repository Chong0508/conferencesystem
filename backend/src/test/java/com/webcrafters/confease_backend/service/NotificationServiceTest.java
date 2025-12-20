package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Notification;
import com.webcrafters.confease_backend.repository.NotificationRepository;
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
public class NotificationServiceTest {

    @Mock
    private NotificationRepository repository;

    @InjectMocks
    private NotificationServiceImpl service;

    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        sampleNotification = new Notification();
        sampleNotification.setNotification_id(1L);
        sampleNotification.setUser_id(101L);
        sampleNotification.setMessage("Your paper submission was successful.");
        sampleNotification.setType("INFO");
        sampleNotification.setIs_read(false);
        sampleNotification.setSent_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all notifications")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleNotification));

        List<Notification> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("INFO", result.get(0).getType());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find notification by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleNotification));

        Notification result = service.getById(1L);

        assertNotNull(result);
        assertEquals(101L, result.getUser_id());
    }

    @Test
    @DisplayName("Should throw exception when notification ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new notification")
    void createTest() {
        when(repository.save(any(Notification.class))).thenReturn(sampleNotification);

        Notification saved = service.create(new Notification());

        assertNotNull(saved);
        assertEquals("INFO", saved.getType());
        verify(repository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should update notification (e.g., mark as read)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Notification.class))).thenReturn(sampleNotification);

        sampleNotification.setIs_read(true);
        Notification updated = service.update(1L, sampleNotification);

        assertNotNull(updated);
        assertTrue(updated.getIs_read());
    }

    @Test
    @DisplayName("Should delete notification successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}