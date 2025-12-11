package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
import org.springframework.stereotype.Service;

@Service
public class PaperKeywordServiceImpl extends CrudServiceImpl<PaperKeyword, PaperKeywordId>
        implements PaperKeywordService {

    public PaperKeywordServiceImpl(PaperKeywordRepository repository) {
        super(repository);
    }
}
