package com.example.demo.controller;

import com.example.demo.dto.PositionInfo;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mock-external")
public class MockExternalApiController {

    @GetMapping("/position/{id}")
    public PositionInfo getPosition(@PathVariable Long id) {
        return new PositionInfo(
                id,
                "Senior Engineering Lead",
                "Technology"
        );
        
    }
}
