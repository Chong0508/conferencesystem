package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.repository.PaymentRepository;
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
public class PaymentServiceTest {

    @Mock
    private PaymentRepository repository;

    @InjectMocks
    private PaymentServiceImpl service;

    private Payment samplePayment;

    @BeforeEach
    void setUp() {
        samplePayment = new Payment();
        samplePayment.setPayment_id(1L);
        samplePayment.setRegistration_id(202L);
        samplePayment.setAmount(150.00);
        samplePayment.setCurrency("USD");
        samplePayment.setStatus("PENDING");
        samplePayment.setPaid_at(Timestamp.from(Instant.now()));
    }

    @Test
    @DisplayName("Should return all payment records")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(samplePayment));

        List<Payment> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(150.00, result.get(0).getAmount());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find payment by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(samplePayment));

        Payment result = service.getById(1L);

        assertNotNull(result);
        assertEquals("USD", result.getCurrency());
    }

    @Test
    @DisplayName("Should throw exception when payment ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new payment record")
    void createTest() {
        when(repository.save(any(Payment.class))).thenReturn(samplePayment);

        Payment saved = service.create(new Payment());

        assertNotNull(saved);
        assertEquals("PENDING", saved.getStatus());
        verify(repository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Should update payment status (e.g., COMPLETED)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Payment.class))).thenReturn(samplePayment);

        samplePayment.setStatus("COMPLETED");
        Payment updated = service.update(1L, samplePayment);

        assertNotNull(updated);
        assertEquals("COMPLETED", updated.getStatus());
    }

    @Test
    @DisplayName("Should delete payment record successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}