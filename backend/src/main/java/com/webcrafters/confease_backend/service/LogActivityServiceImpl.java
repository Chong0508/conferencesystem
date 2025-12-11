package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.LogActivityRepository;
import org.springframework.stereotype.Service;

@Service
public class LogActivityServiceImpl extends CrudServiceImpl<LogActivity, Long>
        implements LogActivityService {

    public LogActivityServiceImpl(LogActivityRepository repository) {
        super(repository);
    }
}
