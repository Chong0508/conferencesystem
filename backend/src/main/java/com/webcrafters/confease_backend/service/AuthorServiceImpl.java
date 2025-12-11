package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Author;
import com.webcrafters.confease_backend.repository.AuthorRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorServiceImpl extends CrudServiceImpl<Author, Long> implements AuthorService {

    public AuthorServiceImpl(AuthorRepository repository) {
        super(repository);
    }
}

