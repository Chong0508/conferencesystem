package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PaperControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PaperRepository paperRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean up before each test
        paperRepository.deleteAll();
        userRepository.deleteAll();

        // Create a test user
        testUser = new User();
        testUser.setEmail("author@test.com");
        testUser.setFirst_name("Test");
        testUser.setLast_name("Author");
        testUser.setPassword_hash("hashedpassword");
        testUser = userRepository.save(testUser);
    }

    @Test
    void testGetPapersByAuthor() {
        // Create test paper with Long userId instead of User object
        Paper paper = new Paper();
        paper.setTitle("Test Paper");
        paper.setAbstractText("Test Abstract");
        paper.setSubmittedBy(testUser.getUser_id()); // ✅ Use Long ID
        paper.setTrackId(1L);
        paper.setStatus("Pending Review");
        paper.setVersion(1);
        paper.setSubmittedAt(LocalDateTime.now());
        paper.setLastUpdated(LocalDateTime.now());
        paperRepository.save(paper);

        // Test the endpoint
        ResponseEntity<Paper[]> response = restTemplate.getForEntity(
            "/api/papers/author/" + testUser.getUser_id(),
            Paper[].class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
        assertEquals("Test Paper", response.getBody()[0].getTitle());
    }

    @Test
    void testGetAllPapers() {
        // Create multiple test papers
        Paper paper1 = new Paper();
        paper1.setTitle("Paper 1");
        paper1.setAbstractText("Abstract 1");
        paper1.setSubmittedBy(testUser.getUser_id()); // ✅ Use Long ID
        paper1.setTrackId(1L);
        paper1.setStatus("Pending Review");
        paper1.setVersion(1);
        paper1.setSubmittedAt(LocalDateTime.now());
        paper1.setLastUpdated(LocalDateTime.now());
        paperRepository.save(paper1);

        Paper paper2 = new Paper();
        paper2.setTitle("Paper 2");
        paper2.setAbstractText("Abstract 2");
        paper2.setSubmittedBy(testUser.getUser_id()); // ✅ Use Long ID
        paper2.setTrackId(1L);
        paper2.setStatus("Pending Review");
        paper2.setVersion(1);
        paper2.setSubmittedAt(LocalDateTime.now());
        paper2.setLastUpdated(LocalDateTime.now());
        paperRepository.save(paper2);

        // Test the endpoint
        ResponseEntity<Paper[]> response = restTemplate.getForEntity(
            "/api/papers",
            Paper[].class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().length);
    }

    @Test
    void testGetPaperById() {
        // Create test paper
        Paper paper = new Paper();
        paper.setTitle("Test Paper");
        paper.setAbstractText("Test Abstract");
        paper.setSubmittedBy(testUser.getUser_id()); // ✅ Use Long ID
        paper.setTrackId(1L);
        paper.setStatus("Pending Review");
        paper.setVersion(1);
        paper.setSubmittedAt(LocalDateTime.now());
        paper.setLastUpdated(LocalDateTime.now());
        Paper savedPaper = paperRepository.save(paper);

        // Test the endpoint
        ResponseEntity<Paper> response = restTemplate.getForEntity(
            "/api/papers/" + savedPaper.getPaperId(),
            Paper.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Paper", response.getBody().getTitle());
        assertEquals(testUser.getUser_id(), response.getBody().getSubmittedBy());
    }

    @Test
    void testGetPaperById_NotFound() {
        ResponseEntity<Paper> response = restTemplate.getForEntity(
            "/api/papers/99999",
            Paper.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeletePaper() {
        // Create test paper
        Paper paper = new Paper();
        paper.setTitle("Test Paper");
        paper.setAbstractText("Test Abstract");
        paper.setSubmittedBy(testUser.getUser_id()); // ✅ Use Long ID
        paper.setTrackId(1L);
        paper.setStatus("Pending Review");
        paper.setVersion(1);
        paper.setSubmittedAt(LocalDateTime.now());
        paper.setLastUpdated(LocalDateTime.now());
        Paper savedPaper = paperRepository.save(paper);

        // Delete the paper
        restTemplate.delete("/api/papers/" + savedPaper.getPaperId());

        // Verify it's deleted
        assertFalse(paperRepository.existsById(savedPaper.getPaperId()));
    }
}