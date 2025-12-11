package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Schedule;
import com.webcrafters.confease_backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

@Service
public class ScheduleServiceImpl extends CrudServiceImpl<Schedule, Long>
        implements ScheduleService {

    public ScheduleServiceImpl(ScheduleRepository repository) {
        super(repository);
    }
}
