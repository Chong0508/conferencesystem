package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.model.Conference;
import com.webcrafters.confease_backend.model.Track;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.UserRepository;
import com.webcrafters.confease_backend.repository.ConferenceRepository;
import com.webcrafters.confease_backend.repository.TrackRepository;
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

    @Autowired
    private ConferenceRepository conferenceRepository; // Added for FK support

    @Autowired
    private TrackRepository trackRepository; // Added for FK support

    private User testUser;
    private Conference testConference;
    private Track testTrack;

    @BeforeEach
    void setUp() {
        // Clean up in reverse order of dependencies
        paperRepository.deleteAll();
        trackRepository.deleteAll();
        conferenceRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Create a test user
        testUser = new User();
        testUser.setEmail("author@test.com");
        testUser.setFirst_name("Test");
        testUser.setLast_name("Author");
        testUser.setPassword_hash("hashedpassword");
        testUser = userRepository.save(testUser);

        // 2. Create a test conference (Required by Paper FK)
        testConference = new Conference();
        testConference.setTitle("Test Conference");
        testConference = conferenceRepository.save(testConference);

        // 3. Create a test track (Required by Paper FK)
        testTrack = new Track();
        testTrack.setName("Test Track");
        testTrack.setConference_id(testConference.getConference_id());
        testTrack = trackRepository.save(testTrack);
    }

    private Paper createBasePaper() {
        Paper paper = new Paper();
        paper.setTitle("Test Paper");
        paper.setAbstractText("Test Abstract");
        paper.setSubmittedBy(testUser.getUser_id());
        paper.setConferenceId(testConference.getConference_id()); // Use saved Conference ID
        paper.setTrackId(testTrack.getTrack_id());           // Use saved Track ID
        paper.setStatus("Pending Review");
        paper.setVersion(1);
        paper.setSubmittedAt(LocalDateTime.now());
        paper.setLastUpdated(LocalDateTime.now());
        return paper;
    }

    @Test
    void testGetPapersByAuthor() {
        Paper paper = createBasePaper();
        paperRepository.save(paper);

        ResponseEntity<Paper[]> response = restTemplate.getForEntity(
            "/api/papers/author/" + testUser.getUser_id(),
            Paper[].class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void testGetAllPapers() {
        paperRepository.save(createBasePaper());
        Paper p2 = createBasePaper();
        p2.setTitle("Second Paper");
        paperRepository.save(p2);

        ResponseEntity<Paper[]> response = restTemplate.getForEntity("/api/papers", Paper[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
    }

    @Test
    void testGetPaperById() {
        Paper savedPaper = paperRepository.save(createBasePaper());

        ResponseEntity<Paper> response = restTemplate.getForEntity(
            "/api/papers/" + savedPaper.getPaperId(),
            Paper.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test Paper", response.getBody().getTitle());
    }

    @Test
    void testGetPaperById_NotFound() {
        ResponseEntity<Paper> response = restTemplate.getForEntity("/api/papers/99999", Paper.class);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeletePaper() {
        Paper savedPaper = paperRepository.save(createBasePaper());

        restTemplate.delete("/api/papers/" + savedPaper.getPaperId());

        assertFalse(paperRepository.existsById(savedPaper.getPaperId()));
    }
}