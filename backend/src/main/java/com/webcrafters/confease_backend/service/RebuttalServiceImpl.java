package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Rebuttal;
import com.webcrafters.confease_backend.repository.RebuttalRepository;
import org.springframework.stereotype.Service;

@Service
public class RebuttalServiceImpl extends CrudServiceImpl<Rebuttal, Long>
        implements RebuttalService {

    public RebuttalServiceImpl(RebuttalRepository repository) {
        super(repository);
    }
}
