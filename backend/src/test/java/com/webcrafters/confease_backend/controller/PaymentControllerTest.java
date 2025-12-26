package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaymentRepository;
import com.webcrafters.confease_backend.repository.PaperRepository;
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
    private PaperRepository paperRepository; // Required by PaymentController

    @Mock
    private LogActivityRepository logActivityRepository; // Required for logging logic

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
        // 1. Prepare the Payment object
        Payment payment = new Payment();
        payment.setPayment_id(1L);
        payment.setAmount(200.0);
        payment.setCurrency("USD");
        payment.setRegistration_id(1L); // This ID is used to find the paper
        payment.setStatus("Completed");

        // 2. Mock the PaperRepository to return a Paper object (to avoid internal logic failure)
        Paper mockPaper = new Paper();
        mockPaper.setPaperId(1L);
        when(paperRepository.findById(1L)).thenReturn(Optional.of(mockPaper));
        
        // 3. Mock the PaymentRepository save
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        
        // 4. Mock the LogActivityRepository to prevent NPE
        when(logActivityRepository.save(any(LogActivity.class))).thenReturn(new LogActivity());

        // 5. Perform request and check for the specific message in your controller
        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Payment processed successfully in KL Time"));
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
    void testUpdatePayment_Success() throws Exception {
        Payment existing = new Payment();
        existing.setPayment_id(1L);
        
        Payment updatedDetails = new Payment();
        updatedDetails.setRegistration_id(1L);
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