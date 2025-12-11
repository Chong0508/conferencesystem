package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.UserRoleId;
import com.webcrafters.confease_backend.repository.UserRoleRepository;
import org.springframework.stereotype.Service;

@Service
public class UserRoleServiceImpl extends CrudServiceImpl<UserRole, UserRoleId> implements UserRoleService {

    public UserRoleServiceImpl(UserRoleRepository repository) {
        super(repository);
    }
}
