package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.PaymentRepository;
import com.webcrafters.confease_backend.repository.LogActivityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private LogActivityRepository logActivityRepository; // Added to prevent 500 errors from logging logic

    @InjectMocks
    private PaymentController paymentController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
    }

    @Test
    void testCreatePayment() throws Exception {
        Payment payment = new Payment();
        payment.setAmount(200.0);
        payment.setCurrency("USD");
        // Ensure these match your model field names
        payment.setPaper_id(1L); 
        payment.setUser_id(1L);

        // Mock the save behavior
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        
        // Mock activity logging if your controller calls it during payment creation
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(new LogActivity());

        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount").value(200.0));
    }

    @Test
    void testGetAllPayments() throws Exception {
        Payment p1 = new Payment();
        p1.setPayment_id(1L);
        p1.setAmount(150.0);

        when(paymentRepository.findAll()).thenReturn(Arrays.asList(p1));

        mockMvc.perform(get("/api/payments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].payment_id").value(1))
                .andExpect(jsonPath("$[0].amount").value(150.0));
    }

    @Test
    void testGetPaymentById_Found() throws Exception {
        Payment payment = new Payment();
        payment.setPayment_id(1L);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

        mockMvc.perform(get("/api/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.payment_id").value(1));
    }

    @Test
    void testDeletePayment_Success() throws Exception {
        when(paymentRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/payments/1"))
                .andExpect(status().isNoContent());
    }
}