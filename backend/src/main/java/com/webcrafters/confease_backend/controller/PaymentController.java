package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

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
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
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
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}