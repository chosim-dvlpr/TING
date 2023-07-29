package com.ssafy.tingbackend.admin.controller;

import com.ssafy.tingbackend.admin.dto.ReportDto;
import com.ssafy.tingbackend.admin.service.AdminService;
import com.ssafy.tingbackend.common.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/admin/report")
    public DataResponse<List<ReportDto>> getReportList(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        List<ReportDto> reportList = adminService.getReportList(pageRequest);

        log.info("pageRequest: {}", pageRequest);
        return new DataResponse<>(200, "신고 리스트 조회 성공", reportList);
    }
}
