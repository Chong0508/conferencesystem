package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends CrudServiceImpl<User, Long> implements UserService {

    public UserServiceImpl(UserRepository repository) {
        super(repository);
    }
}

