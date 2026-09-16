package com.example.orderservice;

import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final String TOPIC = "orders";

    private final KafkaTemplate<String, Order> kafkaTemplate;

    public OrderController(KafkaTemplate<String, Order> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody Order order) {
        kafkaTemplate.send(TOPIC, order.orderId(), order);
        return ResponseEntity.ok("Order published: " + order.orderId());
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("order-service is up");
    }
}
