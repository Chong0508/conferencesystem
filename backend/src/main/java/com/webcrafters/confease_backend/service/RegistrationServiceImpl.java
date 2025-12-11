package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Registration;
import com.webcrafters.confease_backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

@Service
public class RegistrationServiceImpl extends CrudServiceImpl<Registration, Long>
        implements RegistrationService {

    public RegistrationServiceImpl(RegistrationRepository repository) {
        super(repository);
    }
}
