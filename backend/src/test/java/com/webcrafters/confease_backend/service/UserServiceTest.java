package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserServiceImpl service;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setUser_id(1L);
        sampleUser.setEmail("alex.expert@univ.edu");
        sampleUser.setPassword_hash("hashed_password_abc123");
        sampleUser.setFirst_name("Alex");
        sampleUser.setLast_name("Expert");
        sampleUser.setAffiliation("Global Research University");
        sampleUser.setIs_email_verified(true);
        sampleUser.setCreated_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all users")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleUser));
        List<User> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals("alex.expert@univ.edu", result.get(0).getEmail());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find user by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleUser));
        User result = service.getById(1L);
        assertNotNull(result);
        assertEquals("Alex", result.getFirst_name());
    }

    @Test
    @DisplayName("Should throw exception when user ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new user profile")
    void createTest() {
        when(repository.save(any(User.class))).thenReturn(sampleUser);
        User saved = service.create(new User());
        assertNotNull(saved);
        assertTrue(saved.getIs_email_verified());
        verify(repository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update user profile (e.g., change affiliation)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(User.class))).thenReturn(sampleUser);

        sampleUser.setAffiliation("Tech Institute");
        User updated = service.update(1L, sampleUser);

        assertNotNull(updated);
        assertEquals("Tech Institute", updated.getAffiliation());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent user")
    void updateFailTest() {
        when(repository.existsById(99L)).thenReturn(false);
    
        assertThrows(RuntimeException.class, () -> service.update(99L, sampleUser));
        verify(repository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should delete user successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent user")
    void deleteFailTest() {
        when(repository.existsById(99L)).thenReturn(false);
    
        assertThrows(RuntimeException.class, () -> service.delete(99L));
        verify(repository, never()).deleteById(anyLong());
    }
}