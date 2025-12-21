package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Event;
import com.webcrafters.confease_backend.repository.EventRepository;
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

@WebMvcTest(EventController.class)
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // Spring Boot 3.4.0+ modern replacement
    private EventRepository eventRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        sampleEvent = new Event();
        sampleEvent.setEvent_id(1L);
        sampleEvent.setConference_id(10L);
        sampleEvent.setName("Opening Ceremony");
        sampleEvent.setStart_time(Timestamp.valueOf("2025-10-01 09:00:00"));
        sampleEvent.setEnd_time(Timestamp.valueOf("2025-10-01 10:00:00"));
        sampleEvent.setLocation("Main Hall");
    }

    @Test
    @DisplayName("GET /api/events - Success")
    void getAllEvents_ReturnsList() throws Exception {
        when(eventRepository.findAll()).thenReturn(List.of(sampleEvent));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Opening Ceremony"))
                .andExpect(jsonPath("$[0].location").value("Main Hall"));
    }

    @Test
    @DisplayName("GET /api/events/{id} - Found")
    void getEventById_Found_ReturnsEvent() throws Exception {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.event_id").value(1))
                .andExpect(jsonPath("$.name").value("Opening Ceremony"));
    }

    @Test
    @DisplayName("GET /api/events/{id} - Not Found")
    void getEventById_NotFound_Returns404() throws Exception {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/events/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/events - Created")
    void createEvent_Returns201() throws Exception {
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Opening Ceremony"));
    }

    @Test
    @DisplayName("PUT /api/events/{id} - Success")
    void updateEvent_ValidId_ReturnsUpdated() throws Exception {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location").value("Main Hall"));
    }

    @Test
    @DisplayName("DELETE /api/events/{id} - Success")
    void deleteEvent_ValidId_Returns204() throws Exception {
        when(eventRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isNoContent());
    }
}