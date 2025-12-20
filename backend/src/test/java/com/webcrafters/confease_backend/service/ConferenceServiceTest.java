package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Conference;
import com.webcrafters.confease_backend.repository.ConferenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConferenceServiceTest {
  
  @Mock 
  private ConferenceRepository repository;

  @InjectMocks
  private ConferenceServiceImpl service;

  private Conference sampleConf;

  @BeforeEach
  void setup() {
    sampleConf = new Conference();
    sampleConf.setConference_id(1L);
    sampleConf.setTitle("Web Tech 2025");
    sampleConf.setAcronym("WT2025");
    sampleConf.setLocation("Kuala Lumpur");
    sampleConf.setStatus("OPEN");

    // Creating a SQL date for testing
    Date date = Date.valueOf("2025-12-20");
    sampleConf.setStart_date(date);
    sampleConf.setSubmission_deadline(date);
  }

  @Test
  @DisplayName("Should return list of conferences")
  void getAllTest() {
    when(repository.findAll()).thenReturn(List.of(sampleConf));

    List<Conference> result = service.getAll();

    assertEquals(1, result.size());
    assertEquals("WT2025", result.get(0).getAcronym());
    verify(repository, times(1)).findAll();
  }

  @Test
  @DisplayName("Should find conference by ID")
  void getByIdSuccessTest() {
    when(repository.findById(1L)).thenReturn(Optional.of(sampleConf));

    Conference result = service.getById(1L);

    assertNotNull(result);
    assertEquals("Web Tech 2025", result.getTitle());
  }

  @Test
  @DisplayName("Should throw exception when conference ID not found")
  void getByIdFailTest() {
    when(repository.findById(99L)).thenReturn(Optional.empty());

    Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99L));

    assertTrue(exception.getMessage().contains("Data not found: 99"));
  }

  @Test
  @DisplayName("Should create a new conference")
  void createTest() {
    when(repository.save(any(Conference.class))).thenReturn(sampleConf);

    Conference saved = service.create(new Conference());

    assertNotNull(saved);
    assertEquals("OPEN", saved.getStatus());
    verify(repository, times(1)).save(any(Conference.class));
  }

  @Test
  @DisplayName("Should update conference successfully")
  void updateSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);
    when(repository.save(any(Conference.class))).thenReturn(sampleConf);

    Conference updated = service.update(1L, sampleConf);

    assertNotNull(updated);
    verify(repository).existsById(1L);
    verify(repository).save(sampleConf);
  }

  @Test
  @DisplayName("Should delete conference successfully")
  void deleteSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);

    service.delete(1L);

    verify(repository, times(1)).deleteById(1L);
  }

  @Test
  @DisplayName("Should fail to delete if conference does not exist")
  void deleteFailTest() {
    when(repository.existsById(1L)).thenReturn(false);

    assertThrows(RuntimeException.class, () -> service.delete(1L));
    verify(repository, never()).deleteById(1L);
  }

}
