package com.ssafy.tingbackend.point.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.util.HttpUtil;
import com.ssafy.tingbackend.entity.payment.PointCode;
import com.ssafy.tingbackend.entity.payment.PointPayment;
import com.ssafy.tingbackend.entity.point.PointCategory;
import com.ssafy.tingbackend.entity.point.PointHistory;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.point.dto.PaymentDto;
import com.ssafy.tingbackend.point.repository.PointCategoryRepository;
import com.ssafy.tingbackend.point.repository.PointCodeRepository;
import com.ssafy.tingbackend.point.repository.PointHistoryRepository;
import com.ssafy.tingbackend.point.repository.PointPaymentRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoPaymentService {

    private final PointCodeRepository pointCodeRepository;
    private final PointPaymentRepository pointPaymentRepository;
    private final UserRepository userRepository;
    private final PointCategoryRepository pointCategoryRepository;
    private final PointHistoryRepository pointHistoryRepository;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Value("${payment.kakaopay.cid}")
    private String cid;

    @Value("${payment.kakaopay.admin.key}")
    private String adminKey;

    @Value("${payment.kakaopay.url.ready}")
    private String readyUrl;
    @Value("${payment.kakaopay.url.approve}")
    private String approveUrl;

    @Value("${payment.kakaopay.redirectUrl.approvalRedirectUrl}")
    private String approvalRedirectUrl;
    @Value("${payment.kakaopay.redirectUrl.cancelRedirectUrl}")
    private String cancelRedirectUrl;
    @Value("${payment.kakaopay.redirectUrl.failRedirectUrl}")
    private String failRedirectUrl;

    @Transactional
    public PaymentDto.ReadyResponse ready(Long userId, Long pointCode, String domain) {
        PointCode pointItem = pointCodeRepository.findById(pointCode)
                .orElseThrow(() -> new CommonException(ExceptionType.POINT_CODE_NOT_EXIST));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        // 결제 내역 생성
        PointPayment pointPayment = PointPayment.builder()
                .pointCode(pointItem)
                .user(user)
                .cid(cid)
                .quantity(1)
                .build();
        pointPaymentRepository.save(pointPayment);

        // 카카오페이 결제 준비 API 호출
        PaymentDto.KakaoApiReadyResponse kakaoApiReadyResponse = callKakaoPayReadyApi(pointItem, pointPayment, user, domain);

        // pointPayment 업데이트
        pointPayment.setTid(kakaoApiReadyResponse.getTid());
        pointPaymentRepository.save(pointPayment);

        // 응답 DTO 생성
        return PaymentDto.ReadyResponse.builder()
                .pointPaymentId(pointPayment.getId())
                .redirectUrl(kakaoApiReadyResponse.getNext_redirect_pc_url())
                .build();
    }

    @Transactional
    public PaymentDto.ApproveResponse approve(PaymentDto.ApproveRequest approve, String userId) {
        PointPayment pointPayment = pointPaymentRepository.findById(approve.getPointPaymentId())
                .orElseThrow(() -> new CommonException(ExceptionType.POINT_PAYMENT_NOT_FOUND));
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        pointPayment.setPgToken(approve.getPgToken());

        // 결제 승인 API 호출
        PaymentDto.KakaoApiApproveResponse kakaoApiApproveResponse = callKakaoPayApproveApi(pointPayment, user);

        // pointPayment 업데이트
        pointPayment.setAid(kakaoApiApproveResponse.getAid());
        pointPayment.setPaymentMethodType(kakaoApiApproveResponse.getPayment_method_type());
        pointPayment.setCreatedTime(LocalDateTime.now());
        pointPaymentRepository.save(pointPayment);

        // 포인트 변동 기록, 회원 DB의 Point DB에 반영
        insertDatabase(pointPayment, user);

        // 응답 DTO 생성
        return PaymentDto.ApproveResponse.builder()
                .itemName(pointPayment.getPointCode().getItemName())
                .price(pointPayment.getPointCode().getTotalAmount())
                .build();
    }

    private void insertDatabase(PointPayment pointPayment, User user) {
        user.setPoint(user.getPoint() + pointPayment.getPointCode().getTotalAmount());

//        포인트 충전 카테고리
        PointCategory pointCategory = pointCategoryRepository.findById(1L)
                .orElseThrow(() -> new CommonException(ExceptionType.POINT_CATEGORY_NOT_FOUND));

        PointHistory pointHistory = new PointHistory();
        pointHistory.setUser(user);
        pointHistory.setPointCategory(pointCategory);
        pointHistory.setChangeCost((long) pointPayment.getPointCode().getTotalAmount());
        pointHistory.setResultPoint(user.getPoint());
        pointHistory.setCreatedTime(LocalDateTime.now());

        pointHistoryRepository.save(pointHistory);
    }

    private PaymentDto.KakaoApiApproveResponse callKakaoPayApproveApi(PointPayment pointPayment, User user) {
        // 카카오페이 Approve API 요청 본문
        HashMap<String, Object> jsonBody = new HashMap<>();
        jsonBody.put("cid", pointPayment.getCid());
        jsonBody.put("tid", pointPayment.getTid());
        jsonBody.put("partner_order_id", pointPayment.getId());
        jsonBody.put("partner_user_id", user.getId());
        jsonBody.put("pg_token", pointPayment.getPgToken());

        // kakaoPay Approve API 호출
        HashMap<String, Object> response = new HttpUtil()
                .header("Authorization", "KakaoAK " + adminKey)
                .contentType("application", "x-www-form-urlencoded", "UTF-8")
                .body(jsonBody)
                .url(approveUrl)
                .method("POST")
                .build();

        // 결제 승인 호출 실패시 예외처리
        if (Integer.parseInt(response.get("status").toString().substring(0, 3)) != 200) {
            throw new CommonException(ExceptionType.KAKAO_APPROVE_API_FAIL_EXCEPTION);
        }

        // 응답 본문 파싱
        PaymentDto.KakaoApiApproveResponse kakaoApiReadyResponse = null;
        try {
            log.info("kakao approve api response : {}", response);
            kakaoApiReadyResponse = mapper.readValue(response.get("body").toString(), PaymentDto.KakaoApiApproveResponse.class);
        } catch (JsonProcessingException e) {
            log.error("kakao approve api parse error : {}", e.getMessage());
            throw new CommonException(ExceptionType.KAKAO_READY_JSON_PARSE_EXCEPTION);
        }

        return kakaoApiReadyResponse;
    }

    private PaymentDto.KakaoApiReadyResponse callKakaoPayReadyApi(PointCode pointItem, PointPayment pointPayment, User user, String domain) {
        // 카카오페이 Ready API 요청 본문
        HashMap<String, Object> jsonBody = new HashMap<>();
        jsonBody.put("cid", pointPayment.getCid());
        jsonBody.put("partner_order_id", pointPayment.getId());
        jsonBody.put("partner_user_id", user.getId());
        jsonBody.put("item_name", pointItem.getItemName());
        jsonBody.put("quantity", pointPayment.getQuantity());
        jsonBody.put("total_amount", pointItem.getTotalAmount());
        jsonBody.put("tax_free_amount", pointItem.getTaxFreeAmount());
        jsonBody.put("approval_url", domain + approvalRedirectUrl);
        jsonBody.put("cancel_url", domain + cancelRedirectUrl);
        jsonBody.put("fail_url", domain + failRedirectUrl);

        HashMap<String, Object> response = new HttpUtil()
                .header("Authorization", "KakaoAK " + adminKey)
                .contentType("application", "x-www-form-urlencoded", "UTF-8")
                .body(jsonBody)
                .url(readyUrl)
                .method("POST")
                .build();

        // 결제 준비 호출 실패시 예외처리
        if (Integer.parseInt(response.get("status").toString().substring(0, 3)) != 200) {
            throw new CommonException(ExceptionType.KAKAO_READY_API_FAIL_EXCEPTION);
        }

        // 응답 데이터 파싱
        PaymentDto.KakaoApiReadyResponse kakaoApiReadyResponse = null;
        try {
            log.info("kakao ready api response : {}", response);
            kakaoApiReadyResponse = mapper.readValue(response.get("body").toString(), PaymentDto.KakaoApiReadyResponse.class);
        } catch (JsonProcessingException e) {
            log.error("kakao ready api parse error : {}", e.getMessage());
            throw new CommonException(ExceptionType.KAKAO_READY_JSON_PARSE_EXCEPTION);
        }

        return kakaoApiReadyResponse;
    }

}
