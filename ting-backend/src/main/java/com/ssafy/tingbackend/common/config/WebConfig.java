package com.ssafy.tingbackend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS", "HEAD")
                .allowedHeaders("*");
    }

    @Bean
    public Converter<Date, LocalDateTime> dateToLocalDateTimeConverter() {
        return new Converter<Date, LocalDateTime>() {
            @Override
            public LocalDateTime convert(Date source) {
                return source.toInstant().atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime();
            }
        };
    }

}
