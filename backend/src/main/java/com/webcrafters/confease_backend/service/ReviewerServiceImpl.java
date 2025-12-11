package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Reviewer;
import com.webcrafters.confease_backend.repository.ReviewerRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewerServiceImpl extends CrudServiceImpl<Reviewer, Long> implements ReviewerService {

    public ReviewerServiceImpl(ReviewerRepository repository) {
        super(repository);
    }
}

