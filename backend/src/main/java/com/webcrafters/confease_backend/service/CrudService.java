package com.webcrafters.confease_backend.service;

import java.util.List;

public interface CrudService<T, ID> {
    List<T> getAll();
    T getById(ID id);
    T create(T data);
    T update(ID id, T data);
    void delete(ID id);
}
