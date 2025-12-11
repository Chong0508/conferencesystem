package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Event;
import com.webcrafters.confease_backend.repository.EventRepository;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl extends CrudServiceImpl<Event, Long>
        implements EventService {

    public EventServiceImpl(EventRepository repository) {
        super(repository);
    }
}
