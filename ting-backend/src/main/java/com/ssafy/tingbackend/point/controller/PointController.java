package com.ssafy.tingbackend.point.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.point.dto.PaymentDto;
import com.ssafy.tingbackend.point.dto.PointCodeDto;
import com.ssafy.tingbackend.point.dto.PointHistoryDto;
import com.ssafy.tingbackend.point.service.KakaoPaymentService;
import com.ssafy.tingbackend.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PointController {
    private final PointService pointService;
    private final KakaoPaymentService kakaoPaymentService;

    /**
     * 포인트 조회 API
     *
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
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @param map       chargeCost
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
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @param pageNo
     * @return 포인트 사용 내역 조회 정보
     */
    @GetMapping("/point/list")
    public DataResponse<Map<String, Object>> getPointHistory(@RequestParam("pageNo") int pageNo, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        Map<String, Object> result = pointService.getPointHistory(userId, pageNo);
        return new DataResponse<>(200, "포인트 사용 내역 조회 성공", result);
    }

    @GetMapping("/point/charge/list")
    public DataResponse<List<PointCodeDto>> getPointChargeList() {
        return new DataResponse<>(200, "포인트 충전 리스트 조회 성공", pointService.getPointChargeList());
    }

    /**
     * 카카오페이 결제 준비 API 호출
     *
     * @param ready     결제 준비 정보
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 결제 준비 응답 정보
     */
    @PostMapping("/point/kakaopay/ready")
    public DataResponse<PaymentDto.ReadyResponse> chargePointByKakaoPay(@RequestBody PaymentDto.ReadyRequest ready,
                                                                        Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        Long pointCode = ready.getPointCode();

        return new DataResponse<>(200, "카카오페이 결제 준비 API 호출 성공",
                kakaoPaymentService.ready(userId, pointCode, ready.getDomain()));
    }

    /**
     * 카카오페이 결제 승인 API 호출
     *
     * @param approve   결제 승인 정보
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 결제 승인 응답 정보
     */
    @PostMapping("/point/kakaopay/approve")
    public DataResponse<PaymentDto.ApproveResponse> approvePointByKakaoPay(@RequestBody PaymentDto.ApproveRequest approve, Principal principal) {
        PaymentDto.ApproveResponse response = kakaoPaymentService.approve(approve, principal.getName());

        return new DataResponse<>(200, "카카오페이 결제 승인", response);
    }
}
