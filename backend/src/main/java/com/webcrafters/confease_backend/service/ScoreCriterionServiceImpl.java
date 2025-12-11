package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.ScoreCriterion;
import com.webcrafters.confease_backend.repository.ScoreCriterionRepository;
import org.springframework.stereotype.Service;

@Service
public class ScoreCriterionServiceImpl extends CrudServiceImpl<ScoreCriterion, Integer>
        implements ScoreCriterionService {

    public ScoreCriterionServiceImpl(ScoreCriterionRepository repository) {
        super(repository);
    }
}
