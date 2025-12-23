package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KeywordServiceImpl extends CrudServiceImpl<Keyword, Long> implements KeywordService {
    
    @Autowired
    public KeywordServiceImpl(KeywordRepository keywordRepository) {
        super(keywordRepository); // This will now compile because KeywordRepository uses Long
    }
    // ... rest of your code
}
