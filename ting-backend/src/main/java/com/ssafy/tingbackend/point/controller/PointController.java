package com.ssafy.tingbackend.point.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.mypage.dto.QnADto;
import com.ssafy.tingbackend.point.dto.PointHistoryDto;
import com.ssafy.tingbackend.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PointController {
    private final PointService pointService;

    /**
     * 포인트 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 포인트 조회 정보
     */
    @GetMapping("/point")
    public DataResponse<Long> getPoint(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        Long point = pointService.getPoint(userId);
        return new DataResponse<>(200, "포인트 조회 성공", point);
    }

    /**
     * 포인트 충전 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param map chargeCost
     * @return 포인트 조회 정보
     */
    @PostMapping("/point")
    public CommonResponse chargePoint(@RequestBody Map<String, Long> map, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        pointService.chargePoint(userId, map.get("chargeCost"));
        return new CommonResponse(200, "포인트 충전 성공");
    }

    /**
     * 포인트 사용 내역 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param pageNo
     * @return 포인트 사용 내역 조회 정보
     */
    @GetMapping("/point/list")
    public DataResponse<List<PointHistoryDto>> getPointHistory(@RequestParam("pageNo") int pageNo, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        List<PointHistoryDto> pointHistoryList = pointService.getPointHistory(userId, pageNo);
        return new DataResponse<>(200, "포인트 사용 내역 조회 성공", pointHistoryList);
    }
}
