package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.repository.UserRepository;
import io.openvidu.java.client.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final OpenViduService openViduService;

    private final Map<User, DeferredResult<DataResponse>> maleQueue = new LinkedHashMap<>();  // 여성 사용자 대기열
    private final Map<User, DeferredResult<DataResponse>> femaleQueue = new LinkedHashMap<>();  // 남성 사용자 대기열

    public void matchUsers(Long userId, DeferredResult<DataResponse> deferredResult) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        deferredResult.onTimeout(() -> { throw new CommonException(ExceptionType.MATCHING_TIME_OUT); });

        log.info("{}({}) 유저 매칭 시도", user.getEmail(), user.getGender());

        Map<User, DeferredResult<DataResponse>> myQueue = null;
        Map<User, DeferredResult<DataResponse>> yourQueue = null;

        if(user.getGender().equals("M")) {
            myQueue = maleQueue;
            yourQueue = femaleQueue;
        } else if(user.getGender().equals("F")) {
            myQueue = femaleQueue;
            yourQueue = maleQueue;
        }

        User findUser = findWaitingUser(yourQueue);
        if (findUser != null) {
            log.info("{}({}) - {}({}) 매칭 성공", user.getEmail(), user.getGender(), findUser.getEmail(), findUser.getGender());

            try {
                // 매칭이 된 경우 세션 생성하여 사용자들에게 id 반환
                Session session = openViduService.initializeSession();

                yourQueue.get(findUser).setResult(
                        new DataResponse(200, "사용자 매칭 성공", session.getSessionId())
                );
                yourQueue.remove(findUser);

                deferredResult.setResult(
                        new DataResponse(200, "사용자 매칭 성공", session.getSessionId())
                );
            } catch (Exception e) {
                e.printStackTrace();
                throw new CommonException(ExceptionType.OPENVIDU_ERROR);
            }
        } else {
            myQueue.put(user, deferredResult);
        }
    }

    public User findWaitingUser(Map<User, DeferredResult<DataResponse>> queue) {
        for(User user : queue.keySet()) {
            // ==== 매칭 알고리즘 추가 ====
            return user;
        }

        return null;
    }

}
