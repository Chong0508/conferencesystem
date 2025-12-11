package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl extends CrudServiceImpl<Role, Integer> implements RoleService {

    public RoleServiceImpl(RoleRepository repository) {
        super(repository);
    }
}
