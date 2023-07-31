package com.ssafy.tingbackend.matching.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import com.ssafy.tingbackend.matching.dto.WebSocketMessage;
import com.ssafy.tingbackend.matching.repository.MatchingInfoRepository;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.matching.repository.MatchingUserRepository;
import com.ssafy.tingbackend.user.repository.UserHobbyRepository;
import com.ssafy.tingbackend.user.repository.UserPersonalityRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import com.ssafy.tingbackend.user.repository.UserStyleRepository;
import com.sun.xml.bind.Utils;
import io.openvidu.java.client.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;
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
    
//    private final Map<Long, DeferredResult<DataResponse>> acceptQueue = new LinkedHashMap<>();  // 수락한 사용자 대기열
    
    // ============ 웹소켓으로 변경 ==============
    private final Map<String, WebSocketSession> socketSessions = new ConcurrentHashMap<>();
    private final Map<String, User> mQueue = new ConcurrentHashMap<>();
    private final Map<String, User> fQueue = new ConcurrentHashMap<>();
    private final Map<String, User> acceptQueue = new ConcurrentHashMap<>();

    public void waitForMatching(Long userId, WebSocketSession socketSession) {
        socketSessions.put(socketSession.getId(), socketSession);

        User user = getUSerAllData(userId);
        if(user.getGender().equals("M")) mQueue.put(socketSession.getId(), user);
        else fQueue.put(socketSession.getId(), user);
    }

    @Scheduled(fixedDelay = 10_000L)  // 10초에 한번씩 수행
    public void matchingUsers() {
//        System.out.println("matchingUsers() 실행");
        int maxScore = 0;
        String fSessionId = null;
        String mSessionId = null;

        // 여성 사용자 기준 점수가 가장 높은
        for(String fId : fQueue.keySet()) {
            User female = fQueue.get(fId);

            for(String mId : mQueue.keySet()) {
                User male = mQueue.get(mId);
                int score = calculateScore(female, male);

                if(score > maxScore) {
                    maxScore = score;
                    fSessionId = fId;
                    mSessionId = mId;
                } else if(score == maxScore) {  // 동일 점수인 경우 남성 기준으로 점수 계산하여 더 높은 쌍으로
                    int oldScore = calculateScore(mQueue.get(mSessionId), fQueue.get(fSessionId));
                    int newScore = calculateScore(male, female);

                    if(newScore > oldScore) {
                        fSessionId = fId;
                        mSessionId = mId;
                    }
                }
            }
        }

        // 여성, 남성 사용자 모두 있고, 점수가 35점 이상인 경우 세션 생성하여 반환
        if(fSessionId != null && mSessionId != null && maxScore >= 35) {
            try {
                String openViduSessionId = openViduService.initializeSession().getSessionId();
                Map<String, String> messageData = new HashMap<>();
                messageData.put("sessionId", openViduSessionId);
                WebSocketMessage message = new WebSocketMessage("session", messageData);
                TextMessage textMessage = new TextMessage(new ObjectMapper().writeValueAsString(message));

                // 매칭된 사용자의 소켓에 메세지 보내기
                socketSessions.get(fSessionId).sendMessage(textMessage);
                socketSessions.get(mSessionId).sendMessage(textMessage);

                // 대기큐에서 해당 사용자들 제거하고 수락 대기큐로 넣기
                acceptQueue.put(fSessionId, fQueue.get(fSessionId));
                acceptQueue.put(mSessionId, fQueue.get(mSessionId));
                fQueue.remove(fSessionId);
                mQueue.remove(mSessionId);

                // 매칭 정보 몽고디비에 임시 저장
                MatchingInfoDto matchingInfo = new MatchingInfoDto(openViduSessionId, fSessionId, mSessionId);
                matchingInfoRepository.save(matchingInfo);
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
        score += mbtiScore(me.getMbtiCode(), you.getMbtiCode());
        // 종교 기반
        score += religionScore(me.getReligionCode(), you.getReligionCode());
        // 음주 기반
        score += drinkingScore(me.getDrinkingCode(), you.getDrinkingCode());
        // 흡연 기반
        score += smokingScore(me.getSmokingCode(), you.getSmokingCode());

        return score;
    }

    private int smokingScore(AdditionalInfo mySmoking, AdditionalInfo yourSmoking) {
        if(mySmoking == null || yourSmoking == null) return 0;

        int score = 0;
        String yourSmokingName = yourSmoking.getName();

        switch (mySmoking.getName()) {
            case "비흡연":
                if(yourSmokingName.equals("비흡연")) score = 10;
                else score = 0;
                break;
            case "가끔 핌":
                if(yourSmokingName.equals("비흡연") || yourSmokingName.equals("가끔 핌")) score = 10;
                else if(yourSmokingName.equals("전자담배")) score = 7;
                else score = 2;
                break;
            case "자주 핌":
                score = 10;
                break;
            case "전자담배":
                if(yourSmokingName.equals("비흡연") || yourSmokingName.equals("전자담배")) score = 10;
                else if(yourSmokingName.equals("가끔 핌")) score = 7;
                else score = 2;
                break;
        }

//        System.out.println("smokingScore= " + score);
        return score;
    }

    private int drinkingScore(AdditionalInfo myDrinking, AdditionalInfo yourDrinking) {
        if(myDrinking == null || yourDrinking == null) return 0;

        int score = 0;
        String yourDrinkingName = yourDrinking.getName();

        switch (myDrinking.getName()) {
            case "안 마심":
                if(yourDrinkingName.equals("안 마심")) score = 10;
                else if(yourDrinkingName.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
            case "가끔 마심":
                if(yourDrinkingName.equals("가끔 마심")) score = 10;
                else score = 5;
                break;
            case "자주 마심":
                if(yourDrinkingName.equals("자주 마심")) score = 10;
                else if(yourDrinkingName.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
        }

//        System.out.println("drinkingScore= " + score);
        return score;
    }

    private int religionScore(AdditionalInfo myReligion, AdditionalInfo yourReligion) {
        if(myReligion == null || yourReligion == null) return 0;

        if(myReligion.equals(yourReligion)) return 10;
        else return 0;
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

//        System.out.println("styleScore= " + score);
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

    public int mbtiScore(AdditionalInfo myMbti, AdditionalInfo yourMbti) {
        if(myMbti == null || yourMbti == null) return 0;

        int score = 0;
        String yourMbtiName = yourMbti.getName();

        switch (myMbti.getName()) {
            case "INFP":
                if(yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "ENFP":
                if(yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "INFJ":
                if(yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENTP")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP")) score = 16;
                else score = 4;
                break;
            case "ENFJ":
                if(yourMbtiName.equals("INFP") || yourMbtiName.equals("ISFP")) score = 20;
                else if(yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "INTJ":
                if(yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENTP")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ENTJ":
                if(yourMbtiName.equals("INFP") || yourMbtiName.equals("INTP")) score = 20;
                else if(yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 12;
                break;
            case "INTP":
                if(yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESTJ")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") ||
                        yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ENTP":
                if(yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ")) score = 20;
                else if(yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 12;
                else score = 8;
                break;
            case "ISFP":
                if(yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 20;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 12;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ESFP":
                if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 20;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 12;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ISTP":
                if(yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 20;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 12;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ESTP":
                if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 20;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 12;
                else if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP")) score += 8;
                else score = 4;
                break;
            case "ISFJ":
                if(yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score = 20;
                else if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ")) score = 16;
                else if(yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP")) score += 12;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ESFJ":
                if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP")) score = 20;
                else if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ")) score = 16;
                else if(yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score += 12;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ISTJ":
                if(yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score = 20;
                else if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ")) score = 16;
                else if(yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP")) score += 12;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score += 8;
                else score = 4;
                break;
            case "ESTJ":
                if(yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("INTP")) score = 20;
                else if(yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ")) score = 16;
                else if(yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score += 12;
                else if(yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTP")) score += 8;
                else score = 4;
                break;
        }

//        System.out.println("mbtiScore= " + score);
        return score;
    }

    public void finishWaiting(String socketSessionId) {
        socketSessions.remove(socketSessionId);
        if(fQueue.containsKey(socketSessionId)) fQueue.remove(socketSessionId);
        if(mQueue.containsKey(socketSessionId)) mQueue.remove(socketSessionId);
    }

//    public void acceptMatching(String socketSessionId) {
//        MatchingInfoDto matchingInfo = null;
//        Optional<MatchingInfoDto> bySocketSessionIdF = matchingInfoRepository.findBySocketSessionIdF(socketSessionId);
//        if(bySocketSessionIdF.isPresent()) {
//            matchingInfo = bySocketSessionIdF.get();
//        } else {
//            matchingInfo = matchingInfoRepository.findBySocketSessionIdM(socketSessionId)
//                    .orElseThrow(() -> new CommonException(ExceptionType.SOCKET_SESSION_NOT_FOUND));
//        }
//        System.out.println("matchingInfo = " + matchingInfo);
//
//        if(matchingInfo.getSocketSessionIdF().equals(socketSessionId)) {
//            matchingInfo.setIsAcceptF(true);
//        } else if(matchingInfo.getSocketSessionIdM().equals(socketSessionId)) {
//            matchingInfo.setIsAcceptM(true);
//        }
//        matchingInfoRepository.save(matchingInfo);
//
//        Map<String, String> messageData = new HashMap<>();
//
//        // 두 사용자 모두 수락을 선택한 경우
//        if(matchingInfo.getIsAcceptF() != null && matchingInfo.getIsAcceptM() != null &&
//                matchingInfo.getIsAcceptF() && matchingInfo.getIsAcceptM()) {
////            Long opponentUserId = matchingInfo.getUserIdA().equals(userId) ? matchingInfo.getUserIdB() : matchingInfo.getUserIdA();
//
//            // DB에 매칭 정보 저장 (matching, matching_user 테이블)
//            Matching matching = matchingRepository.save(new Matching());
//            User user = userRepository.findById(userId).orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
//            User opponentUser = userRepository.findById(opponentUserId).orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
//            matchingUserRepository.save(new MatchingUser(matching, user));
//            matchingUserRepository.save(new MatchingUser(matching, opponentUser));
//
//            messageData.put("token", openViduService.createConnection(sessionId));
//            messageData.put("matchingId", matching.getId().toString());
//
//            deferredResult.setResult(new DataResponse<>(200, "매칭 성사 성공", messageData));  // 내 요청에 대한 응답
//            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 성사 성공", messageData));  // 상대 요청에 대한 응답
//        } else if(matchingInfo.getIsAcceptF() == null || matchingInfo.getIsAcceptM() == null) {  // 상대가 아직 응답을 하지 않은 경우
//            acceptQueue.put(userId, deferredResult);
//        } else {  // 상대가 이미 거절을 한 경우
//            // ============== 매칭 실패 처리를 어떻게 할지 고민해봐야... ===============
//            messageData.put("token", null);
//            messageData.put("matchingId", null);
//            deferredResult.setResult(new DataResponse<>(200, "매칭 성사 실패", messageData));
//        }
//    }

    public void rejectMatching(Long userId, String sessionId) {
//        MatchingInfoDto matchingInfo = matchingInfoRepository.findBySessionId(sessionId);
//        System.out.println("matchingInfo = " + matchingInfo);
//        System.out.println("acceptQueue = " + acceptQueue);
//
//        if(matchingInfo.getUserIdA().equals(userId)) {
//            matchingInfo.setIsAcceptF(false);
//        } else if(matchingInfo.getUserIdB().equals(userId)) {
//            matchingInfo.setIsAcceptM(false);
//        }
//        matchingInfoRepository.save(matchingInfo);
//
//        // 상대방이 이미 수락한 경우 - 상대방쪽에 응답해줘야 함
//        if(matchingInfo.getIsAcceptF() != null && matchingInfo.getIsAcceptM() != null &&
//                (matchingInfo.getIsAcceptF() || matchingInfo.getIsAcceptM())) {
//            Long opponentUserId = matchingInfo.getUserIdA().equals(userId) ? matchingInfo.getUserIdB() : matchingInfo.getUserIdA();
//
//            Map<String, String> responseMap = new HashMap<>();
//            responseMap.put("token", null);
//            responseMap.put("matchingId", null);
//
//            acceptQueue.get(opponentUserId).setResult(new DataResponse<>(200, "매칭 실패", responseMap));
//        }
    }
}
