package com.ssafy.tingbackend.matching.dto;

import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Document(collection = "matchingInfo")
@Getter
@Setter
@NoArgsConstructor
@ToString(of = {"sessionId", "userIdA", "userIdB", "isAcceptA", "isAcceptB"})
public class MatchingInfoDto {
    @Id
    private String id;
    private String sessionId;
    private Long userIdA;
    private Long userIdB;
    private Boolean isAcceptA;
    private Boolean isAcceptB;

    @Indexed(expireAfterSeconds = 31)
    private LocalDateTime createdAt;

    public MatchingInfoDto(String sessionId, Long userIdA, Long userIdB) {
        this.sessionId = sessionId;
        this.userIdA = userIdA;
        this.userIdB = userIdB;
        this.createdAt = LocalDateTime.now();
    }
}
