package com.webcrafters.confease_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.webcrafters.confease_backend")
public class ConfEaseBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfEaseBackendApplication.class, args);
    }
}

