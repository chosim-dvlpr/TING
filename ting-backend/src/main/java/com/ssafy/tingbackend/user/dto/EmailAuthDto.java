package com.ssafy.tingbackend.user.dto;

import com.mongodb.DBObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.BSONObject;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Set;

@Document(collection = "email")
@Getter
@NoArgsConstructor
@ToString(of = {"email", "key"})
public class EmailAuthDto {

    @Id
    private String id;
    private String email;
    private String key;

    @Indexed(expireAfterSeconds = 5)
    private LocalDateTime createdAt;

    public EmailAuthDto(String email, String key) {
        this.email = email;
        this.key = key;
        this.createdAt = LocalDateTime.now();
    }
}