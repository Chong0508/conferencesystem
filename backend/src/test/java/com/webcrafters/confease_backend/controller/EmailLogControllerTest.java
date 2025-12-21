package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.EmailLog;
import com.webcrafters.confease_backend.repository.EmailLogRepository;
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

@WebMvcTest(EmailLogController.class)
public class EmailLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // Modern replacement for @MockBean in Spring Boot 3.4+
    private EmailLogRepository emailLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private EmailLog sampleLog;

    @BeforeEach
    void setUp() {
        sampleLog = new EmailLog();
        sampleLog.setEmail_id(1L);
        sampleLog.setRecipient_id(100L);
        sampleLog.setRecipient_email("attendee@example.com");
        sampleLog.setSubject("Conference Registration Confirmation");
        sampleLog.setBody("Dear User, your registration is successful.");
        sampleLog.setStatus("SENT");
        sampleLog.setSent_at(new Timestamp(System.currentTimeMillis()));
    }

    @Test
    @DisplayName("GET /api/email-logs - Should return all logs")
    void getAllEmailLogs_ReturnsList() throws Exception {
        when(emailLogRepository.findAll()).thenReturn(List.of(sampleLog));

        mockMvc.perform(get("/api/email-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subject").value("Conference Registration Confirmation"))
                .andExpect(jsonPath("$[0].recipient_email").value("attendee@example.com"));
    }

    @Test
    @DisplayName("GET /api/email-logs/{id} - Found")
    void getEmailLogById_Found_ReturnsLog() throws Exception {
        when(emailLogRepository.findById(1L)).thenReturn(Optional.of(sampleLog));

        mockMvc.perform(get("/api/email-logs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email_id").value(1))
                .andExpect(jsonPath("$.status").value("SENT"));
    }

    @Test
    @DisplayName("GET /api/email-logs/{id} - Not Found")
    void getEmailLogById_NotFound_Returns404() throws Exception {
        when(emailLogRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/email-logs/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/email-logs - Created")
    void createEmailLog_Returns201() throws Exception {
        when(emailLogRepository.save(any(EmailLog.class))).thenReturn(sampleLog);

        mockMvc.perform(post("/api/email-logs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleLog)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subject").value("Conference Registration Confirmation"));
    }

    @Test
    @DisplayName("PUT /api/email-logs/{id} - Success")
    void updateEmailLog_ValidId_ReturnsUpdated() throws Exception {
        when(emailLogRepository.findById(1L)).thenReturn(Optional.of(sampleLog));
        when(emailLogRepository.save(any(EmailLog.class))).thenReturn(sampleLog);

        mockMvc.perform(put("/api/email-logs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleLog)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SENT"));
    }

    @Test
    @DisplayName("DELETE /api/email-logs/{id} - Success")
    void deleteEmailLog_ValidId_Returns204() throws Exception {
        when(emailLogRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/email-logs/1"))
                .andExpect(status().isNoContent());
    }
}