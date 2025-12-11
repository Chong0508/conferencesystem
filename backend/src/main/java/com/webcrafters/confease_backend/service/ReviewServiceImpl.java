package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Review;
import com.webcrafters.confease_backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl extends CrudServiceImpl<Review, Long> implements ReviewService {

    public ReviewServiceImpl(ReviewRepository repository) {
        super(repository);
    }
}

