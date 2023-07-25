package com.ssafy.tingbackend.user.dto;

import com.mongodb.DBObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Date;

@Document(collection = "email")
@Getter
@NoArgsConstructor
@ToString(of = {"email", "key"})
public class EmailAuthDto {

    @Id
    private String id;
    private String email;
    private String key;
    private Date createdAt;

    public EmailAuthDto(String email, String key) {
        this.email = email;
        this.key = key;
    }
}