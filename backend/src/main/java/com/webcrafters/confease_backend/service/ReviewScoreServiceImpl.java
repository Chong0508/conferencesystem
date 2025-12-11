package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.model.ReviewScoreId;
import com.webcrafters.confease_backend.repository.ReviewScoreRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewScoreServiceImpl extends CrudServiceImpl<ReviewScore, ReviewScoreId>
        implements ReviewScoreService {

    public ReviewScoreServiceImpl(ReviewScoreRepository repository) {
        super(repository);
    }
}
