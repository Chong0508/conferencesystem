package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Notification;
import com.webcrafters.confease_backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl extends CrudServiceImpl<Notification, Long>
        implements NotificationService {

    public NotificationServiceImpl(NotificationRepository repository) {
        super(repository);
    }
}
