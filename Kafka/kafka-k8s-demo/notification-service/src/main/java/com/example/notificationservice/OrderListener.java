package com.example.notificationservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class OrderListener {

    private static final Logger log = LoggerFactory.getLogger(OrderListener.class);

    private final List<Order> receivedOrders = new CopyOnWriteArrayList<>();

    @KafkaListener(topics = "orders", groupId = "notification-group")
    public void handleOrder(Order order) {
        // In a real system this would send an email/SMS/push notification.
        log.info("Notification sent for order [{}] - product: {}, quantity: {}",
                order.orderId(), order.product(), order.quantity());
        receivedOrders.add(order);
    }

    public List<Order> getReceivedOrders() {
        return Collections.unmodifiableList(receivedOrders);
    }
}
