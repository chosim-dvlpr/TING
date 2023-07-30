package com.ssafy.tingbackend.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Document(collection = "phoneNumber")
@Getter
@NoArgsConstructor
@ToString(of = {"phoneNumber", "verifiedCode"})
public class PhoneNumberAuthDto {

    @Id
    private String id;
    private String phoneNumber;
    private String authCode;

    @Indexed(expireAfterSeconds = 600)
    private LocalDateTime createdAt;

    public PhoneNumberAuthDto(String phoneNumber, String verifiedCode) {
        this.phoneNumber = phoneNumber;
        this.authCode = verifiedCode;
        this.createdAt = LocalDateTime.now();
    }
}