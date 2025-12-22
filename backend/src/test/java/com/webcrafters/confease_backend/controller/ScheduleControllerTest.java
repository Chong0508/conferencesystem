package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Schedule;
import com.webcrafters.confease_backend.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ScheduleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ScheduleRepository scheduleRepository;

    @InjectMocks
    private ScheduleController scheduleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(scheduleController).build();
    }

    @Test
    void testGetAllSchedules() throws Exception {
        Schedule s1 = new Schedule();
        s1.setSchedule_id(1L);
        s1.setSession_id(101L);

        when(scheduleRepository.findAll()).thenReturn(Arrays.asList(s1));

        mockMvc.perform(get("/api/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].schedule_id").value(1))
                .andExpect(jsonPath("$[0].session_id").value(101));
    }

    @Test
    void testGetScheduleById_Found() throws Exception {
        Schedule schedule = new Schedule();
        schedule.setSchedule_id(1L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        mockMvc.perform(get("/api/schedules/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.schedule_id").value(1));
    }

    @Test
    void testGetScheduleById_NotFound() throws Exception {
        when(scheduleRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/schedules/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateSchedule() throws Exception {
        Schedule schedule = new Schedule();
        schedule.setSession_id(200L);
        schedule.setRoom_id(5L);
        schedule.setStart_time(new Timestamp(System.currentTimeMillis()));

        when(scheduleRepository.save(any(Schedule.class))).thenReturn(schedule);

        mockMvc.perform(post("/api/schedules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(schedule)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.session_id").value(200))
                .andExpect(jsonPath("$.room_id").value(5));
    }

    @Test
    void testUpdateSchedule_Success() throws Exception {
        Schedule existing = new Schedule();
        existing.setSchedule_id(1L);
        
        Schedule updatedDetails = new Schedule();
        updatedDetails.setRoom_id(12L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(existing);

        mockMvc.perform(put("/api/schedules/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.room_id").value(12));
    }

    @Test
    void testDeleteSchedule_Success() throws Exception {
        when(scheduleRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/schedules/1"))
                .andExpect(status().isNoContent());
    }
}