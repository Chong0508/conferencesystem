package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Conference;
import com.webcrafters.confease_backend.repository.ConferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class ConferenceServiceImpl extends CrudServiceImpl<Conference, Long> implements ConferenceService {

    public ConferenceServiceImpl(ConferenceRepository repository) {
        super(repository);
    }
}

