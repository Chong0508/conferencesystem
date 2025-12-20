package com.webcrafters.confease_backend.service;

import com.webcrafters.confease_backend.model.Room;
import com.webcrafters.confease_backend.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTest {

    @Mock
    private RoomRepository repository;

    @InjectMocks
    private RoomServiceImpl service;

    private Room sampleRoom;

    @BeforeEach
    void setUp() {
        sampleRoom = new Room();
        sampleRoom.setRoom_id(1L);
        sampleRoom.setName("Grand Hall A");
        sampleRoom.setCapacity(250);
        sampleRoom.setLocation("Building 1, Floor 2");
    }

    @Test
    @DisplayName("Should return all rooms")
    void getAllTest() {
        when(repository.findAll()).thenReturn(List.of(sampleRoom));

        List<Room> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Grand Hall A", result.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find room by ID")
    void getByIdSuccessTest() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleRoom));

        Room result = service.getById(1L);

        assertNotNull(result);
        assertEquals(250, result.getCapacity());
    }

    @Test
    @DisplayName("Should throw exception when room ID not found")
    void getByIdFailTest() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(99L));
    }

    @Test
    @DisplayName("Should create a new room entry")
    void createTest() {
        when(repository.save(any(Room.class))).thenReturn(sampleRoom);

        Room saved = service.create(new Room());

        assertNotNull(saved);
        assertEquals("Building 1, Floor 2", saved.getLocation());
        verify(repository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("Should update room details (e.g., capacity change)")
    void updateSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Room.class))).thenReturn(sampleRoom);

        sampleRoom.setCapacity(300);
        Room updated = service.update(1L, sampleRoom);

        assertNotNull(updated);
        assertEquals(300, updated.getCapacity());
    }

    @Test
    @DisplayName("Should delete room entry successfully")
    void deleteSuccessTest() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}