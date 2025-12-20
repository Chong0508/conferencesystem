package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.repository.RoleRepository;
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
public class RoleServiceTest {

    @Mock
    private RoleRepository repository;

    @InjectMocks
    private RoleServiceImpl service;

    private Role sampleRole;

    @BeforeEach
    void setUp() {
        sampleRole = new Role();
        sampleRole.setRole_id(1);
        sampleRole.setRole_name("PROGRAM_CHAIR");
        sampleRole.setDescription("Responsible for paper assignments and final decisions.");
    }

    @Test
    @DisplayName("Should return all roles")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleRole));

        List<Role> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("PROGRAM_CHAIR", result.get(0).getRole_name());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find role by Integer ID")
    void getByIdSuccessTest() {
        when(repository.findById(1)).thenReturn(Optional.of(sampleRole));

        Role result = service.getById(1);

        assertNotNull(result);
        assertEquals("PROGRAM_CHAIR", result.getRole_name());
    }

    @Test
    @DisplayName("Should throw exception when role ID not found")
    void getByIdFailTest() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99));
    }

    @Test
    @DisplayName("Should create a new role")
    void createTest() {
        when(repository.save(any(Role.class))).thenReturn(sampleRole);

        Role saved = service.create(new Role());

        assertNotNull(saved);
        assertEquals("Responsible for paper assignments and final decisions.", saved.getDescription());
        verify(repository, times(1)).save(any(Role.class));
    }

    @Test
    @DisplayName("Should update role description")
    void updateSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);
        when(repository.save(any(Role.class))).thenReturn(sampleRole);

        sampleRole.setDescription("Updated description");
        Role updated = service.update(1, sampleRole);

        assertNotNull(updated);
        assertEquals("Updated description", updated.getDescription());
    }

    @Test
    @DisplayName("Should delete role successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1)).thenReturn(true);

        service.delete(1);

        verify(repository, times(1)).deleteById(1);
    }
}