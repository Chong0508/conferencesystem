package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Discussion;
import com.webcrafters.confease_backend.repository.DiscussionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DiscussionServiceTest {
  
  @Mock
  private DiscussionRepository repository;

  @InjectMocks
  private DiscussionServiceImpl service;

  private Discussion sampleDiscussion;

  @BeforeEach
  void setup() {
    sampleDiscussion = new Discussion();
    sampleDiscussion.setDiscussion_id(1L);
    sampleDiscussion.setPaper_id(10L);
    sampleDiscussion.setParticipant_id(5L);
    sampleDiscussion.setMessage("This is a test discussion message.");
    sampleDiscussion.setPosted_at(Timestamp.from(Instant.now()));
  }

  @Test
  @DisplayName("Should return all discussions")
  void getAllTest() {
    when(repository.findAll()).thenReturn(List.of(sampleDiscussion));

    List<Discussion> result = service.getAll();

    assertEquals(1, result.size());
    assertEquals("This is a test discussion message.", result.get(0).getMessage());
    verify(repository, times(1)).findAll();
  }

  @Test
  @DisplayName("Should find discussion by ID")
  void getByIdSuccessTest() {
    when(repository.findById(1L)).thenReturn(Optional.of(sampleDiscussion));

    Discussion result = service.getById(1L);

    assertNotNull(result);
    assertEquals(10L, result.getPaper_id());
  }

  @Test
  @DisplayName("Should throw exception when discussion ID not found")
  void getByIdFailTest() {
    when(repository.findById(99L)).thenReturn(Optional.empty());

    Exception exception = assertThrows(RuntimeException.class, ()  -> service.getById(99L));

    assertTrue(exception.getMessage().contains("Data not found: 99"));
  }

  @Test
  @DisplayName("Should create a new discussion")
  void createTest() {
    when(repository.save(any(Discussion.class))).thenReturn(sampleDiscussion);

    Discussion saved = service.create(new Discussion());

    assertNotNull(saved);
    assertEquals(5L, saved.getParticipant_id());
    verify(repository, times(1)).save(any(Discussion.class));
  }

  @Test
  @DisplayName("Should update discussion successfully")
  void updateSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);
    when(repository.save(any(Discussion.class))).thenReturn(sampleDiscussion);

    Discussion updated = service.update(1L, sampleDiscussion);

    assertNotNull(updated);
    verify(repository).existsById(1L);
    verify(repository).save(sampleDiscussion);
  }

  @Test
  @DisplayName("Should delete discussion successfully")
  void deleteSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);

    service.delete(1L);

    verify(repository, times(1)).deleteById(1L);
  }

  @Test
  @DisplayName("Should fail to delete if discussion does not exist")
  void deleteFailTest() {
    when(repository.existsById(1L)).thenReturn(false);

    assertThrows(RuntimeException.class, ()-> service.delete(1L));
    verify(repository, never()).deleteById(anyLong());
  }
}
