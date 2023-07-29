package com.ssafy.tingbackend.admin.controller;

import com.ssafy.tingbackend.admin.dto.ReportDto;
import com.ssafy.tingbackend.admin.service.AdminService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/admin/report")
    public DataResponse<Map<String, Object>> getReportList(@RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Map<String, Object> reportList = adminService.getReportList(pageRequest);

        return new DataResponse<>(200, "신고 리스트 조회 성공", reportList);
    }

    @GetMapping("/admin/report/{reportId}")
    public DataResponse<ReportDto> getReport(@PathVariable Long reportId) {
        ReportDto reportDto = adminService.getReport(reportId);

        return new DataResponse<>(200, "신고 조회 성공", reportDto);
    }

    @DeleteMapping("/admin/user/{userId}")
    public CommonResponse deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return new CommonResponse(200, "유저 삭제 성공");
    }
}
