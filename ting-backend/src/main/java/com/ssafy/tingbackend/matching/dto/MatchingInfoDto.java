package com.ssafy.tingbackend.matching.dto;

import lombok.*;
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
    private String openViduSessionId;
    private String socketSessionIdF;
    private String socketSessionIdM;
    private Boolean isAcceptF;
    private Boolean isAcceptM;

//    @Indexed(expireAfterSeconds = 31)
    private LocalDateTime createdAt;

    public MatchingInfoDto(String sessionId, String socketSessionIdF, String socketSessionIdM) {
        this.openViduSessionId = sessionId;
        this.socketSessionIdF = socketSessionIdF;
        this.socketSessionIdM = socketSessionIdM;
        this.createdAt = LocalDateTime.now();
    }
}
