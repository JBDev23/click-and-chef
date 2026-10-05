package com.mercadona.hackathon.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, String> testEndpoint() {
        return Map.of(
            "status", "success",
            "message", "¡Backend de Mercadona preparado para el Hackathon!",
            "version", "1.0.0"
        );
    }
}
