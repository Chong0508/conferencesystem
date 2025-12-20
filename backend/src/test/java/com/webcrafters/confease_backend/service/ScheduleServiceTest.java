package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Schedule;
import com.webcrafters.confease_backend.repository.ScheduleRepository;
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
public class ScheduleServiceTest {

    @Mock
    private ScheduleRepository repository;

    @InjectMocks
    private ScheduleServiceImpl service;

    private Schedule sampleSchedule;

    @BeforeEach
    void setUp() {
        Instant now = Instant.now();
        sampleSchedule = new Schedule();
        sampleSchedule.setSchedule_id(1L);
        sampleSchedule.setSession_id(10L);
        sampleSchedule.setRoom_id(5L);
        sampleSchedule.setStart_time(Timestamp.from(now));
        sampleSchedule.setEnd_time(Timestamp.from(now.plus(1, ChronoUnit.HOURS)));
    }

    @Test
    @DisplayName("Should return all schedule entries")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleSchedule));
        List<Schedule> result = service.getAll();
        assertEquals(1, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find schedule by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleSchedule));
        Schedule result = service.getById(1L);
        assertNotNull(result);
        assertEquals(5L, result.getRoom_id());
    }

    @Test
    @DisplayName("Should throw exception when schedule ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new schedule entry")
    void createTest() {
        when(repository.save(any(Schedule.class))).thenReturn(sampleSchedule);
        Schedule saved = service.create(new Schedule());
        assertNotNull(saved);
        assertEquals(10L, saved.getSession_id());
        verify(repository, times(1)).save(any(Schedule.class));
    }

    @Test
    @DisplayName("Should update schedule (e.g., room change)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Schedule.class))).thenReturn(sampleSchedule);

        sampleSchedule.setRoom_id(8L);
        Schedule updated = service.update(1L, sampleSchedule);

        assertNotNull(updated);
        assertEquals(8L, updated.getRoom_id());
    }

    @Test
    @DisplayName("Should delete schedule successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }
}