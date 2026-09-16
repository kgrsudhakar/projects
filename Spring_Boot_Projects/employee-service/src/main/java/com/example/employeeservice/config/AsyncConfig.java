package com.example.employeeservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {

    /**
     * Dedicated pool for fanning out the DB lookup and the external API call
     * in parallel from the service layer, instead of using ForkJoinPool.commonPool().
     */
    @Bean(name = "employeeTaskExecutor")
    public Executor employeeTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8);
        executor.setMaxPoolSize(16);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("employee-svc-");
        executor.initialize();
        return executor;
    }
}
