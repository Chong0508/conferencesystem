package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ReviewAssignment;
import com.webcrafters.confease_backend.repository.ReviewAssignmentRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewAssignmentServiceImpl extends CrudServiceImpl<ReviewAssignment, Long>
        implements ReviewAssignmentService {

    public ReviewAssignmentServiceImpl(ReviewAssignmentRepository repository) {
        super(repository);
    }
}
