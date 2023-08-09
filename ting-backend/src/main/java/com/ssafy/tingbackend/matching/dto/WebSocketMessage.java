package com.ssafy.tingbackend.matching.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import lombok.*;

import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(of = {"type", "data"})
public class WebSocketMessage {
    String type;  // (전송) expectTime, findPair, matchingSuccess, matchingFail / (수신) accept
    Map<String, String> data;

    public String toJson() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new CommonException(ExceptionType.GLOBAL_EXCEPTION);
        }
    }
}
