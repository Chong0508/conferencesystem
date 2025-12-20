package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.LogActivityRepository;
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
class LogActivityServiceTest {

    @Mock
    private LogActivityRepository repository;

    @InjectMocks
    private LogActivityServiceImpl service;

    private LogActivity sampleLog;

    @BeforeEach
    void setUp() {
        sampleLog = new LogActivity();
        sampleLog.setLog_id(1L);
        sampleLog.setUser_id(50L);
        sampleLog.setAction("USER_LOGIN");
        sampleLog.setDetails("User logged in from IP 192.168.1.1");
        sampleLog.setLogin_time(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all activity logs")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleLog));

        List<LogActivity> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("USER_LOGIN", result.get(0).getAction());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find activity log by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleLog));

        LogActivity result = service.getById(1L);

        assertNotNull(result);
        assertEquals(50L, result.getUser_id());
    }

    @Test
    @DisplayName("Should throw exception when activity log ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99L));
        assertTrue(exception.getMessage().contains("Data not found: 99"));
    }

    @Test
    @DisplayName("Should create a new activity log")
    void createTest() {
        when(repository.save(any(LogActivity.class))).thenReturn(sampleLog);

        LogActivity saved = service.create(new LogActivity());

        assertNotNull(saved);
        assertEquals("USER_LOGIN", saved.getAction());
        verify(repository, times(1)).save(any(LogActivity.class));
    }

    @Test
    @DisplayName("Should update activity log (e.g., adding logout time)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(LogActivity.class))).thenReturn(sampleLog);

        sampleLog.setLogout_time(Timestamp.from(Instant.now()));
        LogActivity updated = service.update(1L, sampleLog);

        assertNotNull(updated);
        verify(repository).save(sampleLog);
    }

    @Test
    @DisplayName("Should delete activity log successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should fail to delete if log does not exist")
    void deleteFailTest() {
        when(repository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> service.delete(1L));
        verify(repository, never()).deleteById(anyLong());
    }
}