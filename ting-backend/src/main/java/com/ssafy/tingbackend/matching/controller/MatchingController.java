package com.ssafy.tingbackend.matching.controller;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.matching.service.MatchingService;
import com.ssafy.tingbackend.matching.service.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MatchingController {

    private final MatchingService matchingService;
    private final OpenViduService openViduService;

    /**
     * 매칭 예상시간 API
     *
     * @param
     * @return 예상시간
     */
    @GetMapping("/matching/time")
    public DataResponse<Integer> getExpectTime() {
        // ==== 예상 시간 계산 알고리즘 추가하기 ====
        Integer time = (int) (Math.random() * 5) + 1;  // 1분 ~ 5분 랜덤
        return new DataResponse<>(200, "예상 대기시간 계산 완료", time);
    }

    /**
     * 매칭 시도 API
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 매칭된 결과 세션 ID (비동기)
     */
    @GetMapping("/matching")
    public DeferredResult<DataResponse> matchUsers(Principal principal) {
        long timeout = 600_000L;  // 타임아웃 시간 10분
        DeferredResult<DataResponse> deferredResult = new DeferredResult<>(timeout);

        matchingService.matchUsers(Long.parseLong(principal.getName()), deferredResult);

        return deferredResult;
    }

    /**
     * 매칭 시도 API
     *
     * @param requestMap OpenVidu 세션 ID
     * @return 해당 세션에 접근할 수 있는 토큰 발급
     */
    @PostMapping("/matching/accept")
    public DataResponse matchUsers(@RequestBody Map<String, String> requestMap) {
        String token = openViduService.createConnection(requestMap.get("sessionId"));
        return new DataResponse(200, "토큰 발급 성공", token);
    }

}
