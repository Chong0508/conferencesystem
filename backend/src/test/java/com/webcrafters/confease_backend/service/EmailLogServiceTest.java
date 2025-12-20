package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.EmailLog;
import com.webcrafters.confease_backend.repository.EmailLogRepository;
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
public class EmailLogServiceTest {
@Mock
    private EmailLogRepository repository;

    @InjectMocks
    private EmailLogServiceImpl service;

    private EmailLog sampleLog;

    @BeforeEach
    void setUp() {
        sampleLog = new EmailLog();
        sampleLog.setEmail_id(1L);
        sampleLog.setRecipient_id(101L);
        sampleLog.setRecipient_email("user@example.com");
        sampleLog.setSubject("Conference Registration Confirmation");
        sampleLog.setBody("Hello, your registration for WCT25 is successful.");
        sampleLog.setStatus("SENT");
        sampleLog.setSent_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all email logs")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleLog));

        List<EmailLog> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("user@example.com", result.get(0).getRecipient_email());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find email log by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleLog));

        EmailLog result = service.getById(1L);

        assertNotNull(result);
        assertEquals("SENT", result.getStatus());
    }

    @Test
    @DisplayName("Should throw exception when email log ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99L));
        assertTrue(exception.getMessage().contains("Data not found: 99"));
    }

    @Test
    @DisplayName("Should create a new email log")
    void createTest() {
        when(repository.save(any(EmailLog.class))).thenReturn(sampleLog);

        EmailLog saved = service.create(new EmailLog());

        assertNotNull(saved);
        assertEquals("Conference Registration Confirmation", saved.getSubject());
        verify(repository, times(1)).save(any(EmailLog.class));
    }

    @Test
    @DisplayName("Should update email log successfully")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(EmailLog.class))).thenReturn(sampleLog);

        EmailLog updated = service.update(1L, sampleLog);

        assertNotNull(updated);
        verify(repository).existsById(1L);
    }

    @Test
    @DisplayName("Should delete email log successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should fail to delete if email log does not exist")
    void deleteFailTest() {
        when(repository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> service.delete(1L));
        verify(repository, never()).deleteById(anyLong());
    }
}
