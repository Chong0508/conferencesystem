package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Conference;
import com.webcrafters.confease_backend.repository.ConferenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConferenceController.class)
public class ConferenceControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ConferenceRepository conferenceRepository;

  @Autowired
  private ObjectMapper objectMapper;

  private Conference sampleConference;

  @BeforeEach
  void setUp() {
    sampleConference = new Conference();
    sampleConference.setConference_id(1L);
    sampleConference.setTitle("Global Tech Conference 2025");
    sampleConference.setAcronym("GTC25");
    sampleConference.setLocation("San Francisco");
    sampleConference.setStatus("OPEN");
    sampleConference.setStart_date(Date.valueOf("2025-10-01"));
    sampleConference.setEnd_date(Date.valueOf("2025-10-05"));
  }

  @Test
  @DisplayName("GET /api/conferences - Success")
  void getAllConferences_ReturnsList() throws Exception {
    when(conferenceRepository.findAll()).thenReturn(List.of(sampleConference));

    mockMvc.perform(get("/api/conferences"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Global Tech Conference 2025"))
            .andExpect(jsonPath("$[0].acronym").value("GTC25"));
  }

  @Test
  @DisplayName("GET /api/conferences/{id} - Found")
  void getConferenceById_Found_ReturnsConference() throws Exception {
    when(conferenceRepository.findById(1L)).thenReturn(Optional.of(sampleConference));

    mockMvc.perform(get("/api/conferences/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.conference_id").value(1))
            .andExpect(jsonPath("$.status").value("OPEN"));
  }

  @Test
  @DisplayName("GET /api/conferences/{id} - Not Found")
  void getConferenceById_Found_Returns404() throws Exception {
    when(conferenceRepository.findById(99L)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/conferences/99"))
            .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("POST /api/conferences - Created")
  void createConference_Returns201() throws Exception {
    when(conferenceRepository.save(any(Conference.class))).thenReturn(sampleConference);

    mockMvc.perform(post("/api/conferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sampleConference)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Global Tech Conference 2025"));
  }

  @Test
  @DisplayName("PUT /api/conferences/{id} - Success")
  void updateConference_ValidId_ReturnsUpdated() throws Exception {
    when(conferenceRepository.findById(1L)).thenReturn(Optional.of(sampleConference));
    when(conferenceRepository.save(any(Conference.class))).thenReturn(sampleConference);

    mockMvc.perform(put("/api/conferences/1")
            .contentType(MediaType.APPLICATION_JSON)   // ✅ correct
            .accept(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sampleConference))) // ✅ body here
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.location").value("San Francisco"));
}


  @Test
  @DisplayName("DELETE /api/conferences/{id} - Success")
  void deleteConference_ValidId_Returns204() throws Exception {
    when(conferenceRepository.existsById(1L)).thenReturn(true);

    mockMvc.perform(delete("/api/conferences/1"))
          .andExpect(status().isNoContent());
  }
}
