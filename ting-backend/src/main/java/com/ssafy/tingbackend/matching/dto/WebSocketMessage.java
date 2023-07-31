package com.ssafy.tingbackend.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    String type;  // expectTime, 매칭됨, 수락됨
    Map<String, String> data;
}
