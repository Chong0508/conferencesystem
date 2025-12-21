package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.LogActivityRepository;
import com.webcrafters.confease_backend.service.LogActivityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LogActivityController.class)
class LogActivityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // Modern Spring Boot 3.4+ replacement for @MockBean
    private LogActivityRepository logActivityRepository;

    @MockitoBean
    private LogActivityService logActivityService;

    @Autowired
    private ObjectMapper objectMapper;

    private LogActivity sampleLog;

    @BeforeEach
    void setUp() {
        sampleLog = new LogActivity();
        sampleLog.setLog_id(1L);
        sampleLog.setUser_id(10L);
        sampleLog.setAction("LOGIN");
        sampleLog.setDetails("User logged in from IP 192.168.1.1");
        sampleLog.setLogin_time(new Timestamp(System.currentTimeMillis()));
    }

    @Test
    @DisplayName("GET /api/log-activities - Success")
    void getAllLogActivities_ReturnsList() throws Exception {
        when(logActivityRepository.findAll()).thenReturn(List.of(sampleLog));

        mockMvc.perform(get("/api/log-activities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].action").value("LOGIN"))
                .andExpect(jsonPath("$[0].log_id").value(1));
    }

    @Test
    @DisplayName("GET /api/log-activities/{id} - Found")
    void getLogActivityById_Found_ReturnsLog() throws Exception {
        when(logActivityRepository.findById(1L)).thenReturn(Optional.of(sampleLog));

        mockMvc.perform(get("/api/log-activities/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value(10));
    }

    @Test
    @DisplayName("GET /api/log-activities/{id} - Not Found")
    void getLogActivityById_NotFound_Returns404() throws Exception {
        when(logActivityRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/log-activities/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/log-activities - Created")
    void create_Returns201() throws Exception {
        when(logActivityService.create(any(LogActivity.class))).thenReturn(sampleLog);

        mockMvc.perform(post("/api/log-activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleLog)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.action").value("LOGIN"));
    }

    @Test
    @DisplayName("PUT /api/log-activities/{id} - Success")
    void updateLogActivity_ValidId_ReturnsUpdated() throws Exception {
        when(logActivityRepository.findById(1L)).thenReturn(Optional.of(sampleLog));
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(sampleLog);

        mockMvc.perform(put("/api/log-activities/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleLog)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.details").value("User logged in from IP 192.168.1.1"));
    }

    @Test
    @DisplayName("DELETE /api/log-activities/{id} - Success")
    void deleteLogActivity_ValidId_Returns204() throws Exception {
        when(logActivityRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/log-activities/1"))
                .andExpect(status().isNoContent());
    }
}