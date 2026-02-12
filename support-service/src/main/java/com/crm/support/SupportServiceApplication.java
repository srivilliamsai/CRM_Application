package com.crm.support;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class SupportServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupportServiceApplication.class, args);
    }
}
