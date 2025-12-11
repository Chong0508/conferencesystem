package com.webcrafters.confease_backend.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class CrudServiceImpl<T, ID> implements CrudService<T, ID> {

    protected final JpaRepository<T, ID> repository;

    protected CrudServiceImpl(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    @Override
    public List<T> getAll() {
        return repository.findAll();
    }

    @Override
    public T getById(ID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found: " + id));
    }

    @Override
    public T create(T data) {
        return repository.save(data);
    }

    @Override
    public T update(ID id, T data) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot update. ID not found: " + id);
        }
        return repository.save(data);
    }

    @Override
    public void delete(ID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete. ID not found: " + id);
        }
        repository.deleteById(id);
    }
}

