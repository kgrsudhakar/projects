package com.example.demo;

public class SecondLargest {

    @FunctionalInterface
    interface Calculator {
        int add(int a, int b);
    }
    Calculator calculator = (a, b) -> a + b;
    System.out.println(calculator.add(10, 20));

    public static int secondLargest(int[] arr){
        int largest = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;

        for(int num : arr){
            if(num > largest){
                second = largest;
                largest = num;
            } else if(num > second && num != largest){
                second = num;
            }
        }
        return second;
    }

    public static void main(String[] args){
        int[] arr = {10,20,4,58};
        System.out.println(secondLargest(arr));
    }
}

// HashMap -- one null key and many null values, no thread safe
// ConcurrentHashMap -- no null, thread safe
