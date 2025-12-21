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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setUser_id(1L);
        sampleUser.setEmail("test@conference.com");
        sampleUser.setFirst_name("John");
        sampleUser.setLast_name("Doe");
        sampleUser.setCategory("AUTHOR");
        sampleUser.setIs_email_verified(true);
        sampleUser.setCreated_at(new Timestamp(System.currentTimeMillis()));
    }

    @Test
    @DisplayName("Should return all users")
    void getAll_ReturnsUserList() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<User> users = userService.getAll();

        assertThat(users).hasSize(1);
        assertThat(users.get(0).getEmail()).isEqualTo("test@conference.com");
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find user by valid ID")
    void getById_ValidId_ReturnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        User foundUser = userService.getById(1L);

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getFirst_name()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should throw exception for non-existent user ID")
    void getById_InvalidId_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getById(99L);
        });

        assertThat(exception.getMessage()).contains("Data not found: 99");
    }

    @Test
    @DisplayName("Should create new user successfully")
    void create_SavesUser() {
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        User savedUser = userService.create(new User());

        assertThat(savedUser.getEmail()).isEqualTo("test@conference.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update user when ID exists")
    void update_ExistingId_UpdatesUser() {
        when(userRepository.existsById(1L)).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        User updatedUser = userService.update(1L, sampleUser);

        assertThat(updatedUser).isNotNull();
        verify(userRepository).save(sampleUser);
    }

    @Test
    @DisplayName("Should delete user when ID exists")
    void delete_ExistingId_DeletesUser() {
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        userService.delete(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }
}