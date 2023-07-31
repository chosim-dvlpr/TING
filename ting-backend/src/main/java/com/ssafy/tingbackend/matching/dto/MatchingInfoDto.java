package com.ssafy.tingbackend.matching.dto;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Document(collection = "matchingInfo")
@Getter
@Setter
@NoArgsConstructor
@ToString(of = {"socketSessionIdF", "socketSessionIdM", "isAcceptF", "isAcceptM"})
public class MatchingInfoDto {
    @Id
    private String id;
    private String socketSessionIdF;
    private String socketSessionIdM;
    private Boolean isAcceptF;
    private Boolean isAcceptM;
    private Boolean isValidate;

//    @Indexed(expireAfterSeconds = 31)
    private LocalDateTime createdAt;

    public MatchingInfoDto(String socketSessionIdF, String socketSessionIdM) {
        this.socketSessionIdF = socketSessionIdF;
        this.socketSessionIdM = socketSessionIdM;
        this.isValidate = true;
        this.createdAt = LocalDateTime.now();
    }
}
