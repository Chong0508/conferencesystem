package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.springframework.stereotype.Service;

@Service
public class PaperServiceImpl extends CrudServiceImpl<Paper, Long> implements PaperService {

    public PaperServiceImpl(PaperRepository repository) {
        super(repository);
    }
}
