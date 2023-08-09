package com.ssafy.tingbackend.matching.controller;

import com.ssafy.tingbackend.matching.service.MatchingService;
import com.ssafy.tingbackend.matching.service.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MatchingController {

    private final MatchingService matchingService;
    private final OpenViduService openViduService;



}
