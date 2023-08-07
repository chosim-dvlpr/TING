package com.ssafy.tingbackend.point.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.util.HttpUtil;
import com.ssafy.tingbackend.entity.payment.PointCode;
import com.ssafy.tingbackend.entity.payment.PointPayment;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.point.dto.PaymentDto;
import com.ssafy.tingbackend.point.repository.PointCodeRepository;
import com.ssafy.tingbackend.point.repository.PointPaymentRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoPaymentService {

    private final PointCodeRepository pointCodeRepository;
    private final PointPaymentRepository pointPaymentRepository;
    private final UserRepository userRepository;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Value("${payment.kakaopay.cid}")
    private String cid;

    @Value("${payment.kakaopay.admin.key}")
    private String adminKey;

    @Value("${payment.kakaopay.redirectUrl.dev.approval}")
    private String approvalUrl;
    @Value("${payment.kakaopay.redirectUrl.dev.cancel}")
    private String cancelUrl;
    @Value("${payment.kakaopay.redirectUrl.dev.fail}")
    private String failUrl;

    @Value("${payment.kakaopay.url.ready}")
    private String readyUrl;
    @Value("${payment.kakaopay.url.approve}")
    private String approveUrl;

//    @Value("${payment.kakaopay.redirectUrl.approval}")
//    private String approvalUrl;
//    @Value("${payment.kakaopay.redirectUrl.cancel}")
//    private String cancelUrl;
//    @Value("${payment.kakaopay.redirectUrl.fail}")
//    private String failUrl;

    @Transactional
    public PaymentDto.ReadyResponse ready(Long userId, Long pointCode) {
        PointCode pointItem = pointCodeRepository.findById(pointCode)
                .orElseThrow(() -> new CommonException(ExceptionType.POINT_CODE_NOT_EXIST));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        PointPayment pointPayment = PointPayment.builder()
                .pointCode(pointItem)
                .user(user)
                .cid(cid)
                .quantity(1)
                .build();

        pointPaymentRepository.save(pointPayment);

        // 카카오페이 결제 준비 API 호출
        PaymentDto.KakaoApiReadyResponse kakaoApiReadyResponse = callKakaoPayReadyApi(pointItem, pointPayment, user);

        pointPayment.setTid(kakaoApiReadyResponse.getTid());
        pointPaymentRepository.save(pointPayment);

        PaymentDto.ReadyResponse readyResponse = new PaymentDto.ReadyResponse();
        readyResponse.setPointPaymentId(pointPayment.getId());
        readyResponse.setRedirectUrl(kakaoApiReadyResponse.getNext_redirect_pc_url());

        return readyResponse;
    }

    private PaymentDto.KakaoApiReadyResponse callKakaoPayReadyApi(PointCode pointItem, PointPayment pointPayment, User user) {
        // 카카오페이 Ready API 요청 본문
        HashMap<String, Object> jsonBody = new HashMap<>();
        jsonBody.put("cid", pointPayment.getCid());
        jsonBody.put("partner_order_id", pointPayment.getId());
        jsonBody.put("partner_user_id", user.getId());
        jsonBody.put("item_name", pointItem.getItemName());
        jsonBody.put("quantity", pointPayment.getQuantity());
        jsonBody.put("total_amount", pointItem.getTotalAmount());
        jsonBody.put("tax_free_amount", pointItem.getTaxFreeAmount());
        jsonBody.put("approval_url", approvalUrl);
        jsonBody.put("cancel_url", cancelUrl);
        jsonBody.put("fail_url", failUrl);

        HashMap<String, Object> response = new HttpUtil()
                .header("Authorization", "KakaoAK " + adminKey)
                .contentType("application", "x-www-form-urlencoded", "UTF-8")
                .body(jsonBody)
                .url(readyUrl)
                .method("POST")
                .build();

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
