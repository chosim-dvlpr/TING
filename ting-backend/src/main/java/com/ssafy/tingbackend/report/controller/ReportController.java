package com.ssafy.tingbackend.report.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.report.dto.ReportDto;
import com.ssafy.tingbackend.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/report")
    public CommonResponse report(@RequestBody ReportDto reportDto, Principal principal) {
        reportDto.setUserId(Long.parseLong(principal.getName()));
        reportService.report(reportDto);
        return new CommonResponse(200, "신고 접수 완료");
    }
}
