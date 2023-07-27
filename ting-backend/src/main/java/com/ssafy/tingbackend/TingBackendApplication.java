package com.ssafy.tingbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TingBackendApplication.class, args);
    }

}
