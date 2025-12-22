package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Track;
import com.webcrafters.confease_backend.service.TrackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TrackControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TrackService trackService;

    @InjectMocks
    private TrackController trackController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(trackController).build();
    }

    @Test
    void testGetAllTracks() throws Exception {
        Track t1 = new Track();
        t1.setTrack_id(1L);
        t1.setName("Artificial Intelligence");

        when(trackService.getAll()).thenReturn(Arrays.asList(t1));

        mockMvc.perform(get("/api/tracks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].track_id").value(1))
                .andExpect(jsonPath("$[0].name").value("Artificial Intelligence"));
    }

    @Test
    void testGetTrackById_Found() throws Exception {
        Track track = new Track();
        track.setTrack_id(1L);

        when(trackService.getById(1L)).thenReturn(track);

        mockMvc.perform(get("/api/tracks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.track_id").value(1));
    }

    @Test
    void testGetTrackById_NotFound() throws Exception {
        when(trackService.getById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/tracks/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateTrack() throws Exception {
        Track track = new Track();
        track.setName("Data Science");
        track.setConference_id(10L);

        when(trackService.create(any(Track.class))).thenReturn(track);

        mockMvc.perform(post("/api/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(track)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Data Science"))
                .andExpect(jsonPath("$.conference_id").value(10));
    }

    @Test
    void testUpdateTrack_Success() throws Exception {
        Track updated = new Track();
        updated.setTrack_id(1L);
        updated.setName("Updated Track Name");

        when(trackService.update(eq(1L), any(Track.class))).thenReturn(updated);

        mockMvc.perform(put("/api/tracks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Track Name"));
    }

    @Test
    void testDeleteTrack() throws Exception {
        mockMvc.perform(delete("/api/tracks/1"))
                .andExpect(status().isNoContent());
    }
}