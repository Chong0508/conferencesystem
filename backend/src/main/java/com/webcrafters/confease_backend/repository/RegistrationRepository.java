package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}
