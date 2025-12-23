package com.webcrafters.confease_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // ✅ Forces Spring to use application-test.properties
class ConfEaseBackendApplicationTests {

    @Test
    void contextLoads() {
        // This will now pass as it uses the H2 in-memory context
    }
}