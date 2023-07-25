package com.ssafy.tingbackend.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Document(collection = "email")
@Getter
@NoArgsConstructor
@ToString(of = {"email", "key"})
public class EmailAuthDto {

    @Id
    private String id;
    private String email;
    private String key;

    public EmailAuthDto(String email, String key) {
        this.email = email;
        this.key = key;
    }
}