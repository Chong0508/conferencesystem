package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
}
