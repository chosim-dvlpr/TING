package com.ssafy.tingbackend.chatting.controller;


import com.google.cloud.language.v1.Sentiment;
import com.ssafy.tingbackend.chatting.service.TemperatureService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TemperatureController {

    private final TemperatureService temperatureService;

    @PostMapping("/temperature")
    public CommonResponse apiTest(@RequestBody Map<String, String> requestMap) throws IOException {
        temperatureService.analyzeEntities(requestMap.get("text"));
        return new CommonResponse(200, "감정 분석 성공");
    }

}
