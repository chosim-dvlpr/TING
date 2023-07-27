package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.matching.dto.MatchingInfoDto;
import com.ssafy.tingbackend.matching.dto.MatchingResponseDto;
import com.ssafy.tingbackend.matching.repository.MatchingInfoRepository;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import io.openvidu.java.client.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final OpenViduService openViduService;
    private final MatchingRepository matchingRepository;
    private final MatchingInfoRepository matchingInfoRepository;

    private final Map<User, DeferredResult<DataResponse>> maleQueue = new LinkedHashMap<>();  // 여성 사용자 대기열
    private final Map<User, DeferredResult<DataResponse>> femaleQueue = new LinkedHashMap<>();  // 남성 사용자 대기열
    
    private final Map<Long, DeferredResult<DataResponse>> acceptQueue = new LinkedHashMap<>();  // 수락한 사용자 대기열

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

                // 매칭 정보 몽고디비에 임시 저장
                MatchingInfoDto matchingInfo = new MatchingInfoDto(session.getSessionId(), user.getId(), findUser.getId());
                matchingInfoRepository.save(matchingInfo);
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

    @Transactional
    public void acceptMatching(Long userId, String sessionId, DeferredResult<DataResponse> deferredResult) {
        MatchingInfoDto matchingInfo = matchingInfoRepository.findBySessionId(sessionId);
        System.out.println("matchingInfo = " + matchingInfo);
        System.out.println("acceptQueue = " + acceptQueue);

        if(matchingInfo.getUserIdA().equals(userId)) {
            matchingInfo.setIsAcceptA(true);
        } else if(matchingInfo.getUserIdB().equals(userId)) {
            matchingInfo.setIsAcceptB(true);
        }
        matchingInfoRepository.save(matchingInfo);

        Map<String, String> responseMap = new HashMap<>();

        // 두 사용자 모두 수락을 선택한 경우
        if(matchingInfo.getIsAcceptA() != null && matchingInfo.getIsAcceptB() != null &&
                matchingInfo.getIsAcceptA() && matchingInfo.getIsAcceptB()) {
            // DB에 매칭 정보 저장
            Long matchingId = matchingRepository.save(new Matching()).getId();
            // ==== 소개팅 참여자(matching_user) 정보도 저장하기 ====


            responseMap.put("sessionId", openViduService.createConnection(sessionId));
            responseMap.put("matchingId", matchingId.toString());
            deferredResult.setResult(new DataResponse<>(200, "매칭 성사 성공", responseMap));

            responseMap.put("sessionId", openViduService.createConnection(sessionId));
            Long opponentUserId = matchingInfo.getUserIdA().equals(userId) ? matchingInfo.getUserIdB() : matchingInfo.getUserIdA();
            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 성사 성공", responseMap));
        } else if(matchingInfo.getIsAcceptA() == null || matchingInfo.getIsAcceptB() == null) {  // 상대가 아직 응답을 하지 않은 경우
            acceptQueue.put(userId, deferredResult);
        } else {  // 상대가 이미 거절을 한 경우
            // ==== 매칭 실패 처리를 어떻게 할지 고민해봐야... ====
            responseMap.put("sessionId", null);
            responseMap.put("matchingId", null);
            deferredResult.setResult(new DataResponse<>(200, "매칭 성사 실패", responseMap));
        }
    }

    public void rejectMatching(Long userId, String sessionId) {
        MatchingInfoDto matchingInfo = matchingInfoRepository.findBySessionId(sessionId);
        System.out.println("matchingInfo = " + matchingInfo);
        System.out.println("acceptQueue = " + acceptQueue);

        if(matchingInfo.getUserIdA().equals(userId)) {
            matchingInfo.setIsAcceptA(false);
        } else if(matchingInfo.getUserIdB().equals(userId)) {
            matchingInfo.setIsAcceptB(false);
        }
        matchingInfoRepository.save(matchingInfo);

        // 상대방이 이미 수락한 경우 - 상대방쪽에 응답해줘야 함
        if(matchingInfo.getIsAcceptA() != null && matchingInfo.getIsAcceptB() != null &&
                (matchingInfo.getIsAcceptA() || matchingInfo.getIsAcceptB())) {
            Long opponentUserId = matchingInfo.getUserIdA().equals(userId) ? matchingInfo.getUserIdB() : matchingInfo.getUserIdA();

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("sessionId", null);
            responseMap.put("matchingId", null);

            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 실패", responseMap));
        }
    }
}
