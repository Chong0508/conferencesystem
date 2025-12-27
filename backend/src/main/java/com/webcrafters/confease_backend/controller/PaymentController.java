package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.PaymentRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost", allowCredentials = "true")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaperRepository paperRepository;

    // Get all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new payment
    @PostMapping
    @Transactional // Ensures both payment and paper update succeed or fail together
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
        try {
            // 1. Set Kuala Lumpur Time for the payment
            ZonedDateTime klTime = ZonedDateTime.now(ZoneId.of("Asia/Kuala_Lumpur"));
            payment.setPaid_at(Timestamp.from(klTime.toInstant()));
            
            // Set default status if not provided
            if (payment.getStatus() == null) {
                payment.setStatus("Completed");
            }

            Payment savedPayment = paymentRepository.save(payment);

            // 2. Automatically update the linked Paper status
            paperRepository.findById(payment.getRegistration_id()).ifPresent(paper -> {
                paper.setStatus("Registered");
                paperRepository.save(paper);
            });

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Payment processed successfully in KL Time",
                "paymentId", savedPayment.getPayment_id(),
                "status", "Registered"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing payment: " + e.getMessage());
        }
    }

    // Get payments specifically for a paper (registration_id)
    @GetMapping("/paper/{paperId}")
    public ResponseEntity<List<Payment>> getPaymentsByPaper(@PathVariable Long paperId) {
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getRegistration_id().equals(paperId))
                .toList();
        return ResponseEntity.ok(payments);
    }

    // Update an existing payment
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment paymentDetails) {
        Optional<Payment> optionalPayment = paymentRepository.findById(id);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            // Update fields
            payment.setRegistration_id(paymentDetails.getRegistration_id());
            payment.setAmount(paymentDetails.getAmount());
            payment.setCurrency(paymentDetails.getCurrency());
            payment.setReceipt_file(paymentDetails.getReceipt_file());
            payment.setStatus(paymentDetails.getStatus());
            // Note: paid_at is typically not updated, as it's a timestamp for when the payment was made

            Payment updatedPayment = paymentRepository.save(payment);
            return ResponseEntity.ok(updatedPayment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a payment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}