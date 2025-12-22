package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Room;
import com.webcrafters.confease_backend.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RoomControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomController roomController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(roomController).build();
    }

    @Test
    void testGetAllRooms() throws Exception {
        Room r1 = new Room();
        r1.setRoom_id(1L);
        r1.setName("Grand Ballroom");

        when(roomRepository.findAll()).thenReturn(Arrays.asList(r1));

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].room_id").value(1))
                .andExpect(jsonPath("$[0].name").value("Grand Ballroom"));
    }

    @Test
    void testGetRoomById_Found() throws Exception {
        Room room = new Room();
        room.setRoom_id(1L);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        mockMvc.perform(get("/api/rooms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.room_id").value(1));
    }

    @Test
    void testGetRoomById_NotFound() throws Exception {
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rooms/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateRoom() throws Exception {
        Room room = new Room();
        room.setName("Seminar Room A");
        room.setCapacity(50);

        when(roomRepository.save(any(Room.class))).thenReturn(room);

        mockMvc.perform(post("/api/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(room)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Seminar Room A"))
                .andExpect(jsonPath("$.capacity").value(50));
    }

    @Test
    void testUpdateRoom_Success() throws Exception {
        Room existing = new Room();
        existing.setRoom_id(1L);
        
        Room updatedDetails = new Room();
        updatedDetails.setName("Updated Room Name");
        updatedDetails.setCapacity(100);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(roomRepository.save(any(Room.class))).thenReturn(existing);

        mockMvc.perform(put("/api/rooms/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Room Name"))
                .andExpect(jsonPath("$.capacity").value(100));
    }

    @Test
    void testDeleteRoom_Success() throws Exception {
        when(roomRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/rooms/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteRoom_NotFound() throws Exception {
        when(roomRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/rooms/1"))
                .andExpect(status().isNotFound());
    }
}