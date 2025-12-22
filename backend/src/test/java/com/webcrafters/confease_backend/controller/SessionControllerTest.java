package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.webcrafters.confease_backend.model.Session;
import com.webcrafters.confease_backend.service.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SessionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
        
        // Critical: Register JavaTimeModule to handle LocalDateTime serialization
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testGetAllSessions() throws Exception {
        Session s1 = new Session();
        s1.setSessionId(1L);
        s1.setTitle("Opening Keynote");

        when(sessionService.getAll()).thenReturn(Arrays.asList(s1));

        mockMvc.perform(get("/api/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sessionId").value(1))
                .andExpect(jsonPath("$[0].title").value("Opening Keynote"));
    }

    @Test
    void testGetSessionById_Found() throws Exception {
        Session session = new Session();
        session.setSessionId(1L);

        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(get("/api/sessions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").value(1));
    }

    @Test
    void testGetSessionById_NotFound() throws Exception {
        when(sessionService.getById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/sessions/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateSession() throws Exception {
        Session session = new Session();
        session.setTitle("Tech Workshop");
        session.setStartTime(LocalDateTime.of(2025, 12, 21, 10, 0, 0));
        session.setSpeakerName("Jane Doe");

        when(sessionService.create(any(Session.class))).thenReturn(session);

        mockMvc.perform(post("/api/sessions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(session)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Tech Workshop"))
                .andExpect(jsonPath("$.speaker").value("Jane Doe"));
    }

    @Test
    void testUpdateSession_Success() throws Exception {
        Session updated = new Session();
        updated.setSessionId(1L);
        updated.setTitle("Updated Workshop");

        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(updated);

        mockMvc.perform(put("/api/sessions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Workshop"));
    }

    @Test
    void testDeleteSession() throws Exception {
        mockMvc.perform(delete("/api/sessions/1"))
                .andExpect(status().isNoContent());
    }
}