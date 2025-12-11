package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.EmailLog;
import com.webcrafters.confease_backend.repository.EmailLogRepository;
import org.springframework.stereotype.Service;

@Service
public class EmailLogServiceImpl extends CrudServiceImpl<EmailLog, Long>
        implements EmailLogService {

    public EmailLogServiceImpl(EmailLogRepository repository) {
        super(repository);
    }
}
