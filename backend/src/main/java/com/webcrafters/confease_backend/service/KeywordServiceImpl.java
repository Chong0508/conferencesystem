package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import org.springframework.stereotype.Service;

@Service
public class KeywordServiceImpl extends CrudServiceImpl<Keyword, Integer>
        implements KeywordService {

    public KeywordServiceImpl(KeywordRepository repository) {
        super(repository);
    }
}
