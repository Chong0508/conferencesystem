package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.UserRoleId;
import com.webcrafters.confease_backend.repository.UserRoleRepository;
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
public class UserRoleServiceTest {

    @Mock
    private UserRoleRepository repository;

    @InjectMocks
    private UserRoleServiceImpl service;

    private UserRole sampleUserRole;
    private UserRoleId sampleId;

    @BeforeEach
    void setUp() {
        sampleId = new UserRoleId(1L, 2);
        
        sampleUserRole = new UserRole();
        sampleUserRole.setUser_id(1L);
        sampleUserRole.setRole_id(2);
        sampleUserRole.setAssigned_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all user-role mappings")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleUserRole));
        List<UserRole> result = service.getAll();
        assertEquals(1, result.size());
        assertEquals(2, result.get(0).getRole_id());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find mapping by composite ID")
    void getByIdSuccessTest() {
        when(repository.findById(any(UserRoleId.class))).thenReturn(Optional.of(sampleUserRole));
        UserRole result = service.getById(sampleId);
        assertNotNull(result);
        assertEquals(1L, result.getUser_id());
    }

    @Test
    @DisplayName("Should throw exception when mapping not found")
    void getByIdFailTest() {
        when(repository.findById(any(UserRoleId.class))).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getById(sampleId));
    }

    @Test
    @DisplayName("Should create a new role assignment")
    void createTest() {
        when(repository.save(any(UserRole.class))).thenReturn(sampleUserRole);
        UserRole saved = service.create(new UserRole());
        assertNotNull(saved);
        assertEquals(1L, saved.getUser_id());
        verify(repository, times(1)).save(any(UserRole.class));
    }

    @Test
    @DisplayName("Should delete role assignment successfully")
    void deleteSuccessTest() {
        when(repository.existsById(any(UserRoleId.class))).thenReturn(true);
        service.delete(sampleId);
        verify(repository, times(1)).deleteById(any(UserRoleId.class));
    }
}