package com.example.notificationservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final OrderListener orderListener;

    public NotificationController(OrderListener orderListener) {
        this.orderListener = orderListener;
    }

    @GetMapping
    public List<Order> recent() {
        return orderListener.getReceivedOrders();
    }

    @GetMapping("/health")
    public String health() {
        return "notification-service is up";
    }
}
