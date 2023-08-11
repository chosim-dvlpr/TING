package com.ssafy.tingbackend.admin.controller;

import com.ssafy.tingbackend.admin.dto.AdminQnaDto;
import com.ssafy.tingbackend.admin.dto.AdminReportDto;
import com.ssafy.tingbackend.admin.service.AdminService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.user.dto.UserDto;
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
    public DataResponse<AdminReportDto> getReport(@PathVariable Long reportId) {
        AdminReportDto adminReportDto = adminService.getReport(reportId);

        return new DataResponse<>(200, "신고 조회 성공", adminReportDto);
    }

    @PostMapping("/admin/report")
    public CommonResponse registerComment(@RequestBody Map<String, String> requestMap) {
        Long reportId = Long.parseLong(requestMap.get("reportId"));
        String comment = requestMap.get("comment");
        adminService.registerComment(reportId, comment);

        return new CommonResponse(200, "관리자 의견 등록 성공");
    }

    @GetMapping("/admin/user/{userId}")
    public DataResponse<UserDto.Detail> getUser(@PathVariable Long userId) {
        return new DataResponse<>(200, "유저 조회 성공", adminService.getUser(userId));
    }

    @DeleteMapping("/admin/user/{userId}")
    public CommonResponse deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return new CommonResponse(200, "유저 삭제 성공");
    }

    @GetMapping("/admin/user/login")
    public DataResponse<Map<String, Object>> getLoginLogList(@RequestParam(defaultValue = "1") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Map<String, Object> loginLogList = adminService.getLoginLogList(pageRequest);

        return new DataResponse<>(200, "로그인 로그 리스트 조회 성공", loginLogList);
    }

    @GetMapping("/admin/qna")
    public DataResponse<Map<String, Object>> getQnaList(@RequestParam(defaultValue = "1") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Map<String, Object> qnaList = adminService.getQnaList(pageRequest);

        return new DataResponse<>(200, "QnA 리스트 조회 성공", qnaList);
    }

    @GetMapping("/admin/qna/{qnaId}")
    public DataResponse<AdminQnaDto> getQna(@PathVariable Long qnaId) {
        AdminQnaDto adminQnaDto = adminService.getQna(qnaId);

        return new DataResponse<>(200, "QnA 조회 성공", adminQnaDto);
    }

    @PostMapping("/admin/qna/{qnaId}")
    public CommonResponse answerQna(@PathVariable Long qnaId, @RequestBody Map<String, String> body) {
        adminService.answerQna(qnaId, body.get("answer"));

        return new CommonResponse(200, "QnA 답변 성공");
    }

    @GetMapping("/admin/payment/history20")
    public DataResponse<Map<String, Object>> getPointPaymentHistory() {
        Map<String, Object> history = adminService.pointPaymentHistoryFor20Day();
        return new DataResponse<>(200, "매출 리스트 조회 성공", history);
    }

    @GetMapping("/admin/matching/history20")
    public DataResponse<Map<String, Object>> getMatchingHistory() {
        Map<String, Object> history = adminService.matchingHistoryFor20Day();
        return new DataResponse<>(200, "매칭 리스트 조회 성공", history);
    }

    @GetMapping("/admin/matching/count")
    public DataResponse<Map<String, Integer>> getMatchingCount() {
        Integer count = adminService.matchingCount();
        return new DataResponse<>(200, "매칭 수 조회 성공", Map.of("totalCount", count));
    }

    @GetMapping("/admin/user/count")
    public DataResponse<Map<String, Integer>> getUserCount() {
        Integer count = adminService.userCount();
        return new DataResponse<>(200, "유저 수 조회 성공", Map.of("totalCount", count));
    }

    @GetMapping("/admin/report/count")
    public DataResponse<Map<String, Integer>> getReportCount() {
        Integer count = adminService.reportCount();
        return new DataResponse<>(200, "신고 수 조회 성공", Map.of("totalCount", count));
    }

    @GetMapping("/admin/profit/total")
    public DataResponse<Map<String, Long>> getTotalProfit() {
        Long totalProfit = adminService.totalProfit();
        return new DataResponse<>(200, "총 매출 조회 성공", Map.of("totalProfit", totalProfit));
    }
}
