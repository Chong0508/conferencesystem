package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Author;
import com.webcrafters.confease_backend.repository.AuthorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthorServiceTest {
  
  @Mock
  private AuthorRepository repository;

  @InjectMocks
  private AuthorServiceImpl service;

  private Author sampleAuthor;

  @BeforeEach
  void setup() {
    sampleAuthor = new Author();
    sampleAuthor.setAuthor_id(1L);
    sampleAuthor.setPaper_id(100L);
    sampleAuthor.setUser_id(50L);
    sampleAuthor.setAuthor_order(1);
    sampleAuthor.setIs_corresponding(true);
  }

  @Test
  @DisplayName("Should return all authors")
  void getAllTest() {
    when(repository.findAll()).thenReturn(List.of(sampleAuthor));

    List<Author> result = service.getAll();

    assertEquals(1, result.size());
    assertEquals(100L, result.get(0).getPaper_id());
    verify(repository, times(1)).findAll();
  }

  @Test
  @DisplayName("Should find author by ID when exists")
  void getByIdSuccessTest() {
    when(repository.findById(1L)).thenReturn(Optional.of(sampleAuthor));

    Author result = service.getById(1L);

    assertNotNull(result);
    assertEquals(1L, result.getAuthor_id());
    assertEquals(true, result.getIs_corresponding());
  }

  @Test
  @DisplayName("Should throw exception when finding no-existent ID")
  void getByIdFailTest() {
    when(repository.findById(99L)).thenReturn(Optional.empty());

    Exception exception = assertThrows(RuntimeException.class, () -> service.getById(99L));

    assertTrue(exception.getMessage().contains("Data not found: 99"));
  }

  @Test
  @DisplayName("Should save new author")
  void createTest() {
    when(repository.save(any(Author.class))).thenReturn(sampleAuthor);

    Author saved = service.create(new Author());

    assertNotNull(saved);
    assertEquals(50L, saved.getUser_id());
    verify(repository, times(1)).save(any(Author.class));
  }

  @Test
  @DisplayName("Should update author if ID exists")
  void updateSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);
    when(repository.save(any(Author.class))).thenReturn(sampleAuthor);

    Author updated = service.update(1L, sampleAuthor);

    assertNotNull(updated);
    assertEquals(1, updated.getAuthor_order());
    verify(repository).existsById(1L);
    verify(repository).save(sampleAuthor);
  }

  @Test
  @DisplayName("Should delete author if ID exists")
  void deleteSuccessTest() {
    when(repository.existsById(1L)).thenReturn(true);

    service.delete(1L);

    verify(repository, times(1)).deleteById(1L);
  }

  @Test
  @DisplayName("Should throw exception on delete if ID not found")
  void deleteFailTest() {
    when(repository.existsById(1L)).thenReturn(false);

    assertThrows(RuntimeException.class, () -> service.delete(1L));
    verify(repository, never()).deleteById(anyLong());
  }
}
