package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.repository.PaymentRepository;
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

    @InjectMocks
    private PaymentController paymentController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
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
    void testGetPaymentById_NotFound() throws Exception {
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/payments/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreatePayment() throws Exception {
        Payment payment = new Payment();
        payment.setAmount(200.0);
        payment.setCurrency("USD");

        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount").value(200.0));
    }

    @Test
    void testUpdatePayment_Success() throws Exception {
        Payment existing = new Payment();
        existing.setPayment_id(1L);
        
        Payment updatedDetails = new Payment();
        updatedDetails.setAmount(300.0);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(paymentRepository.save(any(Payment.class))).thenReturn(existing);

        mockMvc.perform(put("/api/payments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(300.0));
    }

    @Test
    void testDeletePayment_Success() throws Exception {
        when(paymentRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/payments/1"))
                .andExpect(status().isNoContent());
    }
}