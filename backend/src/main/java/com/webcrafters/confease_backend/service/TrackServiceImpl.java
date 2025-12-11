package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Track;
import com.webcrafters.confease_backend.repository.TrackRepository;
import org.springframework.stereotype.Service;

@Service
public class TrackServiceImpl extends CrudServiceImpl<Track, Long> implements TrackService {

    public TrackServiceImpl(TrackRepository repository) {
        super(repository);
    }
}
