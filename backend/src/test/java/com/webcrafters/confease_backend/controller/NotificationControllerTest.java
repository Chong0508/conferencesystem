package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Notification;
import com.webcrafters.confease_backend.repository.NotificationRepository;
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

@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // Modern 2025 replacement for @MockBean
    private NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        sampleNotification = new Notification();
        sampleNotification.setNotification_id(1L);
        sampleNotification.setUser_id(10L);
        sampleNotification.setMessage("Your paper has been accepted!");
        sampleNotification.setType("ALERT");
        sampleNotification.setIs_read(false);
        sampleNotification.setSent_at(new Timestamp(System.currentTimeMillis()));
    }

    @Test
    @DisplayName("GET /api/notifications - Success")
    void getAllNotifications_ReturnsList() throws Exception {
        when(notificationRepository.findAll()).thenReturn(List.of(sampleNotification));

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Your paper has been accepted!"))
                .andExpect(jsonPath("$[0].notification_id").value(1));
    }

    @Test
    @DisplayName("GET /api/notifications/{id} - Found")
    void getNotificationById_Found_ReturnsNotification() throws Exception {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(sampleNotification));

        mockMvc.perform(get("/api/notifications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("ALERT"));
    }

    @Test
    @DisplayName("GET /api/notifications/{id} - Not Found")
    void getNotificationById_NotFound_Returns404() throws Exception {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/notifications/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/notifications - Created")
    void createNotification_Returns201() throws Exception {
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotification);

        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleNotification)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Your paper has been accepted!"));
    }

    @Test
    @DisplayName("PUT /api/notifications/{id} - Success")
    void updateNotification_ValidId_ReturnsUpdated() throws Exception {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotification);

        mockMvc.perform(put("/api/notifications/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleNotification)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.is_read").value(false));
    }

    @Test
    @DisplayName("DELETE /api/notifications/{id} - Success")
    void deleteNotification_ValidId_Returns204() throws Exception {
        when(notificationRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isNoContent());
    }
}