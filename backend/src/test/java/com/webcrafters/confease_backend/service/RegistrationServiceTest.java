package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Registration;
import com.webcrafters.confease_backend.repository.RegistrationRepository;
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
public class RegistrationServiceTest {

    @Mock
    private RegistrationRepository repository;

    @InjectMocks
    private RegistrationServiceImpl service;

    private Registration sampleRegistration;

    @BeforeEach
    void setUp() {
        sampleRegistration = new Registration();
        sampleRegistration.setRegistration_id(1L);
        sampleRegistration.setUser_id(10L);
        sampleRegistration.setConference_id(100L);
        sampleRegistration.setRegistration_type("PROFESSIONAL");
        sampleRegistration.setEarly_bird(true);
        sampleRegistration.setPayment_status("PENDING");
        sampleRegistration.setRegistered_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all registrations")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleRegistration));

        List<Registration> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("PROFESSIONAL", result.get(0).getRegistration_type());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find registration by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleRegistration));

        Registration result = service.getById(1L);

        assertNotNull(result);
        assertEquals(10L, result.getUser_id());
    }

    @Test
    @DisplayName("Should throw exception when registration ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new registration")
    void createTest() {
        when(repository.save(any(Registration.class))).thenReturn(sampleRegistration);

        Registration saved = service.create(new Registration());

        assertNotNull(saved);
        assertTrue(saved.getEarly_bird());
        verify(repository, times(1)).save(any(Registration.class));
    }

    @Test
    @DisplayName("Should update payment status")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Registration.class))).thenReturn(sampleRegistration);

        sampleRegistration.setPayment_status("PAID");
        Registration updated = service.update(1L, sampleRegistration);

        assertNotNull(updated);
        assertEquals("PAID", updated.getPayment_status());
    }

    @Test
    @DisplayName("Should delete registration successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}