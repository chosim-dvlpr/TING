package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.repository.UserRepository;
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

    private final Map<User, DeferredResult<DataResponse>> maleQueue = new LinkedHashMap<>();
    private final Map<User, DeferredResult<DataResponse>> femaleQueue = new LinkedHashMap<>();
    private static int matchNo = 1;

    public void matchUsers(Long userId, DeferredResult<DataResponse> deferredResult) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        deferredResult.onTimeout(() -> { throw new CommonException(ExceptionType.MATCHING_TIME_OUT); });

        log.info("{}({}) 유저 매칭 시도", user.getEmail(), user.getGender());

        System.out.println("=========================");
        System.out.println("male: " + maleQueue.toString());
        System.out.println("female: " + femaleQueue.toString());

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
            // 이 부분에서 세션 만들어서 각 여성, 남성 사용자에게 응답 보내주면 될 듯
            log.info("{}({}) - {}({}) 매칭 성공", user.getEmail(), user.getGender(), findUser.getEmail(), findUser.getGender());
            DataResponse response = new DataResponse(200, "사용자 매칭 성공", matchNo++);
            yourQueue.get(findUser).setResult(response);
            yourQueue.remove(findUser);
            deferredResult.setResult(response);
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
