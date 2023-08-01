package com.ssafy.tingbackend.friend.controller;


import com.ssafy.tingbackend.friend.service.TemperatureService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TemperatureController {

    private final TemperatureService temperatureService;

    @PostMapping("/temperature")
    public CommonResponse apiTest(@RequestBody Map<String, String> requestMap) throws IOException {
//        BigDecimal score = temperatureService.analyzeEntities(requestMap.get("text"));
//        System.out.println(score);
        temperatureService.updateTeperature();
        return new CommonResponse(200, "감정 분석 성공");
    }

}
