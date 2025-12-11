package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Room;
import com.webcrafters.confease_backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl extends CrudServiceImpl<Room, Long>
        implements RoomService {

    public RoomServiceImpl(RoomRepository repository) {
        super(repository);
    }
}
