package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Author;
import com.webcrafters.confease_backend.service.AuthorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthorController.class)
class AuthorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthorService authorService;

    @Autowired
    private ObjectMapper objectMapper; // Converts Java objects to JSON

    private Author sampleAuthor;

    @BeforeEach
    void setUp() {
        sampleAuthor = new Author();
        sampleAuthor.setAuthor_id(1L);
        sampleAuthor.setPaper_id(100L);
        sampleAuthor.setUser_id(50L);
        sampleAuthor.setAuthor_order(1);
        sampleAuthor.setIs_corresponding(true);
    }

    @Test
    @DisplayName("GET /api/author - Success")
    void getAll_ReturnsList() throws Exception {
        when(authorService.getAll()).thenReturn(List.of(sampleAuthor));

        mockMvc.perform(get("/api/author"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].author_id").value(1))
                .andExpect(jsonPath("$[0].is_corresponding").value(true));
    }

    @Test
    @DisplayName("GET /api/author/{id} - Success")
    void getById_ValidId_ReturnsAuthor() throws Exception {
        when(authorService.getById(1L)).thenReturn(sampleAuthor);

        mockMvc.perform(get("/api/author/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paper_id").value(100));
    }

    @Test
    @DisplayName("POST /api/author - Success")
    void create_SavesAuthor() throws Exception {
        when(authorService.create(any(Author.class))).thenReturn(sampleAuthor);

        mockMvc.perform(post("/api/author")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleAuthor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author_id").value(1));
    }

    @Test
    @DisplayName("PUT /api/author/{id} - Success")
    void update_ExistingId_ReturnsUpdatedAuthor() throws Exception {
        when(authorService.update(eq(1L), any(Author.class))).thenReturn(sampleAuthor);

        mockMvc.perform(put("/api/author/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleAuthor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author_order").value(1));
    }

    @Test
    @DisplayName("DELETE /api/author/{id} - Success")
    void delete_Returns200() throws Exception {
        mockMvc.perform(delete("/api/author/1"))
                .andExpect(status().isOk());
    }
}