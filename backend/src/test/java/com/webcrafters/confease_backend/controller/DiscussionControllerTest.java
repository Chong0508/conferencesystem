package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Discussion;
import com.webcrafters.confease_backend.repository.DiscussionRepository;
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

@WebMvcTest(DiscussionController.class)
public class DiscussionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DiscussionRepository discussionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Discussion sampleDiscussion;

    @BeforeEach
    void setUp() {
        sampleDiscussion = new Discussion();
        sampleDiscussion.setDiscussion_id(1L);
        sampleDiscussion.setPaper_id(101L);
        sampleDiscussion.setParticipant_id(50L);
        sampleDiscussion.setMessage("This paper has excellent methodology.");
        sampleDiscussion.setPosted_at(new Timestamp(System.currentTimeMillis()));
    }

    @Test
    @DisplayName("GET / - Should return all discussions")
    void getAllDiscussions_ReturnsList() throws Exception {
        when(discussionRepository.findAll()).thenReturn(List.of(sampleDiscussion));

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("This paper has excellent methodology."))
                .andExpect(jsonPath("$[0].discussion_id").value(1));
    }

    @Test
    @DisplayName("GET /{id} - Should return discussion when found")
    void getDiscussionById_Found_ReturnsDiscussion() throws Exception {
        when(discussionRepository.findById(1L)).thenReturn(Optional.of(sampleDiscussion));

        mockMvc.perform(get("/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paper_id").value(101));
    }

    @Test
    @DisplayName("GET /{id} - Should return 404 when not found")
    void getDiscussionById_NotFound_Returns404() throws Exception {
        when(discussionRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST / - Should create new discussion")
    void createDiscussion_Returns201() throws Exception {
        when(discussionRepository.save(any(Discussion.class))).thenReturn(sampleDiscussion);

        mockMvc.perform(post("/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleDiscussion)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.discussion_id").value(1));
    }

    @Test
    @DisplayName("PUT /{id} - Should update and return 200")
    void updateDiscussion_Exists_ReturnsUpdated() throws Exception {
        when(discussionRepository.findById(1L)).thenReturn(Optional.of(sampleDiscussion));
        when(discussionRepository.save(any(Discussion.class))).thenReturn(sampleDiscussion);

        mockMvc.perform(put("/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleDiscussion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("This paper has excellent methodology."));
    }

    @Test
    @DisplayName("DELETE /{id} - Should return 204 when deleted")
    void deleteDiscussion_Exists_ReturnsNoContent() throws Exception {
        when(discussionRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/1"))
                .andExpect(status().isNoContent());
    }
}