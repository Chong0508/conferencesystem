package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Session;
import com.webcrafters.confease_backend.repository.SessionRepository;
import org.springframework.stereotype.Service;

@Service
public class SessionServiceImpl extends CrudServiceImpl<Session, Long>
        implements SessionService {

    public SessionServiceImpl(SessionRepository repository) {
        super(repository);
    }
}
