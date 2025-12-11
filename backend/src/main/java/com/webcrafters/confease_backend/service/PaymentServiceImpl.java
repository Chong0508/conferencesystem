package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Payment;
import com.webcrafters.confease_backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl extends CrudServiceImpl<Payment, Long>
        implements PaymentService {

    public PaymentServiceImpl(PaymentRepository repository) {
        super(repository);
    }
}
