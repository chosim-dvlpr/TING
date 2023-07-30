package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingUser;
import com.ssafy.tingbackend.entity.user.AdditionalInfo;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.entity.user.UserHobby;
import com.ssafy.tingbackend.entity.user.UserStyle;
import com.ssafy.tingbackend.matching.dto.MatchingInfoDto;
import com.ssafy.tingbackend.matching.repository.MatchingInfoRepository;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.matching.repository.MatchingUserRepository;
import com.ssafy.tingbackend.user.repository.UserHobbyRepository;
import com.ssafy.tingbackend.user.repository.UserPersonalityRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import com.ssafy.tingbackend.user.repository.UserStyleRepository;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final UserHobbyRepository userHobbyRepository;
    private final UserPersonalityRepository userPersonalityRepository;
    private final UserStyleRepository userStyleRepository;

    private final OpenViduService openViduService;
    private final MatchingRepository matchingRepository;
    private final MatchingUserRepository matchingUserRepository;
    private final MatchingInfoRepository matchingInfoRepository;

    private final Map<User, DeferredResult<DataResponse>> maleQueue = new LinkedHashMap<>();  // 여성 사용자 대기열
    private final Map<User, DeferredResult<DataResponse>> femaleQueue = new LinkedHashMap<>();  // 남성 사용자 대기열
    
    private final Map<Long, DeferredResult<DataResponse>> acceptQueue = new LinkedHashMap<>();  // 수락한 사용자 대기열

    public void matchUsers(Long userId, DeferredResult<DataResponse> deferredResult) {
        User user = getUSerAllData(userId);
        System.out.println("===============================");
        System.out.println(user);
        System.out.println("===============================");
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
            int score = calculateScore(user, findUser);
            log.info("score: {}", score);

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
        User findUser = null;

        for(User user : queue.keySet()) {
            // ================== 매칭 알고리즘 추가 ==================
            findUser = user;
        }

        return findUser;
    }

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
            Long opponentUserId = matchingInfo.getUserIdA().equals(userId) ? matchingInfo.getUserIdB() : matchingInfo.getUserIdA();

            // DB에 매칭 정보 저장 (matching, matching_user 테이블)
            Matching matching = matchingRepository.save(new Matching());
            User user = userRepository.findById(userId).orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            User opponentUser = userRepository.findById(opponentUserId).orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            matchingUserRepository.save(new MatchingUser(matching, user));
            matchingUserRepository.save(new MatchingUser(matching, opponentUser));

            responseMap.put("token", openViduService.createConnection(sessionId));
            responseMap.put("matchingId", matching.getId().toString());

            deferredResult.setResult(new DataResponse<>(200, "매칭 성사 성공", responseMap));  // 내 요청에 대한 응답
            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 성사 성공", responseMap));  // 상대 요청에 대한 응답
        } else if(matchingInfo.getIsAcceptA() == null || matchingInfo.getIsAcceptB() == null) {  // 상대가 아직 응답을 하지 않은 경우
            acceptQueue.put(userId, deferredResult);
        } else {  // 상대가 이미 거절을 한 경우
            // ============== 매칭 실패 처리를 어떻게 할지 고민해봐야... ===============
            responseMap.put("token", null);
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
            responseMap.put("token", null);
            responseMap.put("matchingId", null);

            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 실패", responseMap));
        }
    }
    
    // 웹소켓으로 변경
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, User> mQueue = new ConcurrentHashMap<>();
    private final Map<String, User> fQueue = new ConcurrentHashMap<>();

    public void waitForMatching(Long userId, WebSocketSession session) {
        sessions.put(session.getId(), session);

        User user = getUSerAllData(userId);
        if(user.getGender().equals("M")) mQueue.put(session.getId(), user);
        else fQueue.put(session.getId(), user);

        System.out.println(sessions.size());
        System.out.println("male = " + mQueue);
        System.out.println("female = " + fQueue);

        if(mQueue.size() > 0 && fQueue.size() > 0) matchingUsers();
    }

    private void matchingUsers() {
        int maxScore = 0;
        String fSessionId = null;
        String mSessionId = null;

        // 점수가 가장 높은
        for(String fId : fQueue.keySet()) {
            User female = fQueue.get(fId);

            for(String mId : mQueue.keySet()) {
                User male = mQueue.get(mId);
                int score = calculateScore(female, male);

                if(score > maxScore) {
                    maxScore = score;
                    fSessionId = fId;
                    mSessionId = mId;
                }
            }
        }

        if(fSessionId != null && mSessionId != null) {
            // 매칭이 된 경우 세션 생성하여 사용자들에게 id 반환
            try {
                Session openViduSession = openViduService.initializeSession();
                sessions.get(fSessionId).sendMessage(new TextMessage(openViduSession.getSessionId()));
                sessions.get(mSessionId).sendMessage(new TextMessage(openViduSession.getSessionId()));
            } catch (Exception e) {
                e.printStackTrace();
                throw new CommonException(ExceptionType.OPENVIDU_ERROR);
            }
        }
    }

    public User getUSerAllData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        user.setUserHobbys(userHobbyRepository.findAllByUserId(userId));
        user.setUserPersonalities(userPersonalityRepository.findAllByUserId(userId));
        user.setUserStyles(userStyleRepository.findAllByUserId(userId));

        return user;
    }

    // 매칭 상대 결정을 위한 점수 계산
    public int calculateScore(User me, User you) {
        int score = 0;

        // 선호 스타일 기반
        score += styleScore(me, you);
        // mbti 기반
        score += mbtiScore(me.getMbtiCode().getName(), you.getMbtiCode().getName());
        // 종교 기반
        score += religionScore(me.getReligionCode(), you.getReligionCode());
        // 음주 기반
        score += drinkingScore(me.getDrinkingCode().getName(), you.getDrinkingCode().getName());
        // 흡연 기반
        score += smokingScore(me.getSmokingCode(), you.getSmokingCode());

        return score;
    }

    private int smokingScore(AdditionalInfo mySmoking, AdditionalInfo yourSmoking) {
        int score = 0;

        if(mySmoking.equals(yourSmoking)) score =  10;
        else score =  0;

        System.out.println("smokingScore= " + score);
        return score;
    }

    private int drinkingScore(String myDrinking, String yourDrinking) {
        int score = 0;

        switch (myDrinking) {
            case "안 마심":
                if(yourDrinking.equals("안 마심")) score = 10;
                else if(yourDrinking.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
            case "가끔 마심":
                if(yourDrinking.equals("가끔 마심")) score = 10;
                else score = 5;
                break;
            case "자주 마심":
                if(yourDrinking.equals("자주 마심")) score = 10;
                else if(yourDrinking.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
        }

        System.out.println("drinkingScore= " + score);
        return score;
    }

    private int religionScore(AdditionalInfo myReligion, AdditionalInfo yourReligion) {
        int score = 0;

        if(myReligion.equals(yourReligion)) score =  10;
        else score = 0;

        System.out.println("religionScore= " + score);
        return score;
    }

    public int styleScore(User me, User you) {
        int score = 0;

        for(UserStyle userStyle : me.getUserStyles()) {
            AdditionalInfo addInfo = userStyle.getAdditionalInfo();
            switch (addInfo.getName()) {
                case "동갑":
                    if(me.getBirth().getYear() == you.getBirth().getYear()) score += 10;
                    break;
                case "연상":
                    if(me.getBirth().getYear() < you.getBirth().getYear()) score += 10;
                    break;
                case "연하":
                    if(me.getBirth().getYear() > you.getBirth().getYear()) score += 10;
                    break;
                case "같은 동네":
                    if(me.getRegion().equals(you.getRegion())) score += 10;
                    break;
                case "장거리":
                    if(!me.getRegion().equals(you.getRegion())) score += 10;
                    break;
                case "취미가 같은":
                    if(hasSameHobby(me.getUserHobbys(), you.getUserHobbys())) score += 10;
                    break;
                case "유사 직종":
                    if(me.getJobCode().equals(you.getJobCode())) score += 10;
                    break;
            }
        }

        System.out.println("styleScore= " + score);
        return score;
    }

    private boolean hasSameHobby(List<UserHobby> myHobbys, List<UserHobby> yourHobbys) {
        // 하나라도 겹치는 취미가 있으면 true 반환
        for(UserHobby myhobby : myHobbys) {
            AdditionalInfo hobbyAddInfo = myhobby.getAdditionalInfo();
            for(UserHobby yourHobby : yourHobbys) {
                if(yourHobby.getAdditionalInfo().equals(hobbyAddInfo)) return true;
            }
        }
        
        return false;
    }

    public int mbtiScore(String myMbti, String yourMbti) {
        int score = 0;

        switch (myMbti) {
            case "INFP":
                if(yourMbti.equals("ENFJ") || yourMbti.equals("ENTJ")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("ENFP") || yourMbti.equals("INFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "ENFP":
                if(yourMbti.equals("ENFJ") || yourMbti.equals("ENTJ")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("ENFP") || yourMbti.equals("INFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "INFJ":
                if(yourMbti.equals("ENFP") || yourMbti.equals("ENTP")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("INFJ") || yourMbti.equals("ENFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("ENTJ") || yourMbti.equals("INTP")) score = 16;
                else score = 4;
                break;
            case "ENFJ":
                if(yourMbti.equals("INFP") || yourMbti.equals("ISFP")) score = 20;
                else if(yourMbti.equals("ENFP") || yourMbti.equals("INFJ") || yourMbti.equals("ENFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "INTJ":
                if(yourMbti.equals("ENFP") || yourMbti.equals("ENTP")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("INFJ") || yourMbti.equals("ENFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ENTJ":
                if(yourMbti.equals("INFP") || yourMbti.equals("INTP")) score = 20;
                else if(yourMbti.equals("ENFP") || yourMbti.equals("INFJ") || yourMbti.equals("ENFJ") || yourMbti.equals("INTJ") ||
                        yourMbti.equals("ENTJ") || yourMbti.equals("ENTP")) score = 16;
                else score = 12;
                break;
            case "INTP":
                if(yourMbti.equals("ENTJ") || yourMbti.equals("ESTJ")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("ENFP") || yourMbti.equals("INFJ") || yourMbti.equals("ENFJ") ||
                        yourMbti.equals("INTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ENTP":
                if(yourMbti.equals("INFJ") || yourMbti.equals("INTJ")) score = 20;
                else if(yourMbti.equals("INFP") || yourMbti.equals("ENFP") || yourMbti.equals("ENFJ") || yourMbti.equals("ENTJ") ||
                        yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score = 16;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ISFP":
                if(yourMbti.equals("ENFJ") || yourMbti.equals("ESFJ") || yourMbti.equals("ESTJ")) score = 20;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP") ||
                        yourMbti.equals("ISFJ") || yourMbti.equals("ISTJ")) score = 12;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ESFP":
                if(yourMbti.equals("ISFJ") || yourMbti.equals("ISTJ")) score = 20;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP") ||
                        yourMbti.equals("ESFJ") || yourMbti.equals("ESTJ")) score = 12;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ISTP":
                if(yourMbti.equals("ESFJ") || yourMbti.equals("ESTJ")) score = 20;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP") ||
                        yourMbti.equals("ISFJ") || yourMbti.equals("ISTJ")) score = 12;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ESTP":
                if(yourMbti.equals("ISFJ") || yourMbti.equals("ISTJ")) score = 20;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("ENTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP") ||
                        yourMbti.equals("ESFJ") || yourMbti.equals("ESTJ")) score = 12;
                else if(yourMbti.equals("ISFP") || yourMbti.equals("ESFP") || yourMbti.equals("ISTP") || yourMbti.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ISFJ":
                if(yourMbti.equals("ESFP") || yourMbti.equals("ESTP")) score = 20;
                else if(yourMbti.equals("ISFJ") || yourMbti.equals("ESFJ") || yourMbti.equals("ISTJ") || yourMbti.equals("ESTJ")) score = 16;
                else if(yourMbti.equals("ENTJ") || yourMbti.equals("ISFP") || yourMbti.equals("ISTP")) score += 12;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ESFJ":
                if(yourMbti.equals("ISFP") || yourMbti.equals("ISTP")) score = 20;
                else if(yourMbti.equals("ISFJ") || yourMbti.equals("ESFJ") || yourMbti.equals("ISTJ") || yourMbti.equals("ESTJ")) score = 16;
                else if(yourMbti.equals("ENTJ") || yourMbti.equals("ESFP") || yourMbti.equals("ESTP")) score += 12;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ISTJ":
                if(yourMbti.equals("ESFP") || yourMbti.equals("ESTP")) score = 20;
                else if(yourMbti.equals("ISFJ") || yourMbti.equals("ESFJ") || yourMbti.equals("ISTJ") || yourMbti.equals("ESTJ")) score = 16;
                else if(yourMbti.equals("ENTJ") || yourMbti.equals("ISFP") || yourMbti.equals("ISTP")) score += 12;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("INTP") || yourMbti.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ESTJ":
                if(yourMbti.equals("ISFP") || yourMbti.equals("ISTP") || yourMbti.equals("INTP")) score = 20;
                else if(yourMbti.equals("ISFJ") || yourMbti.equals("ESFJ") || yourMbti.equals("ISTJ") || yourMbti.equals("ESTJ")) score = 16;
                else if(yourMbti.equals("ENTJ") || yourMbti.equals("ESFP") || yourMbti.equals("ESTP")) score += 12;
                else if(yourMbti.equals("INTJ") || yourMbti.equals("ENTP")) score += 8;
                else score = 4;
                break;
        }

        System.out.println("mbtiScore= " + score);
        return score;
    }

    public void finishWaiting(String sessionId) {
        sessions.remove(sessionId);
        if(fQueue.containsKey(sessionId)) fQueue.remove(sessionId);
        if(mQueue.containsKey(sessionId)) mQueue.remove(sessionId);
    }
}
