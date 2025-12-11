package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Discussion;
import com.webcrafters.confease_backend.repository.DiscussionRepository;
import org.springframework.stereotype.Service;

@Service
public class DiscussionServiceImpl extends CrudServiceImpl<Discussion, Long>
        implements DiscussionService {

    public DiscussionServiceImpl(DiscussionRepository repository) {
        super(repository);
    }
}
