package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.*;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {

        String sentence = "This is a stream problem";

        String longestWord = Arrays.stream(sentence.split(" "))
                .max(Comparator.comparingInt(String::length))
                .orElse("");

        System.out.println(longestWord);

        SpringApplication.run(DemoApplication.class, args);
    }

}
