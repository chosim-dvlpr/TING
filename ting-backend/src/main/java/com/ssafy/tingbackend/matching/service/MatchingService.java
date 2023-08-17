package com.ssafy.tingbackend.matching.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.security.JwtUtil;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.repository.QuestionRepository;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingQuestion;
import com.ssafy.tingbackend.entity.matching.MatchingUser;
import com.ssafy.tingbackend.entity.matching.Question;
import com.ssafy.tingbackend.entity.type.QuestionType;
import com.ssafy.tingbackend.entity.user.AdditionalInfo;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.entity.user.UserHobby;
import com.ssafy.tingbackend.entity.user.UserStyle;
import com.ssafy.tingbackend.matching.dto.MatchingInfoDto;
import com.ssafy.tingbackend.matching.dto.WebSocketInfo;
import com.ssafy.tingbackend.matching.dto.WebSocketMessage;
import com.ssafy.tingbackend.matching.repository.MatchingInfoRepository;
import com.ssafy.tingbackend.matching.repository.MatchingQuestionRepository;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.matching.repository.MatchingUserRepository;
import com.ssafy.tingbackend.user.repository.UserHobbyRepository;
import com.ssafy.tingbackend.user.repository.UserPersonalityRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import com.ssafy.tingbackend.user.repository.UserStyleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final UserHobbyRepository userHobbyRepository;
    private final UserPersonalityRepository userPersonalityRepository;
    private final UserStyleRepository userStyleRepository;

    private final OpenViduService openViduService;
    private final MatchingInfoRepository matchingInfoRepository;
    private final MatchingRepository matchingRepository;
    private final MatchingUserRepository matchingUserRepository;
    private final QuestionRepository questionRepository;
    private final MatchingQuestionRepository matchingQuestionRepository;

    // WebSocketSessionId를 키로 사용
    private final Map<String, WebSocketInfo> socketInfos = new ConcurrentHashMap<>();  // 소켓 연결 정보
    private final List<String> mQueue = new CopyOnWriteArrayList<>();  // 남성 사용자 대기열
    private final List<String> fQueue = new CopyOnWriteArrayList<>();  // 여성 사용자 대기열
    private final List<String> acceptQueue = new CopyOnWriteArrayList<>();  // 매칭 후 수락을 기다리는 대기열

    public void connectSocket(WebSocketSession socketSession) {
        socketInfos.put(socketSession.getId(), new WebSocketInfo(socketSession, 0));
    }


    public void waitForMatching(String socketSessionId, String token) throws IOException {
        log.info("waitForMatching");

        // 소켓연결정보에 유저 정보 넣기
        Long userId = Long.parseLong(JwtUtil.getPayloadAndCheckExpired(token).get("userId").toString());
        User user = getUserAllData(userId);
        socketInfos.get(socketSessionId).setUser(user);

        // 유저 성별에 해당하는 대기열에 넣기
        int time = 60 + Math.round((float) Math.random() * 60); // 1분 ~ 2분

        // 선택정보 입력개수에 따른 대기시간 계산 (최대 1분 20초)
        time += calcAdditionalInfo(user);

        if ("M".equals(user.getGender())) {
            mQueue.add(socketSessionId);

            // 이성의 대기 큐 인원수에 따른 대기시간 계산
            if (fQueue.isEmpty()) {
                time += 60;
            } else if (fQueue.size() < 5) {
                time += 10;
            } else if (fQueue.size() < 10) {
                time += 3;
            } else {
                time = Math.max(time - 60, 0);
            }
        } else {
            fQueue.add(socketSessionId);

            // 이성의 대기 큐 인원수에 따른 대기시간 계산
            if (mQueue.isEmpty()) {
                time += 60;
            } else if (mQueue.size() < 5) {
                time += 10;
            } else if (mQueue.size() < 10) {
                time += 3;
            } else {
                time = Math.max(time - 60, 0);
            }
        }

        log.info("대기열에 추가 - {}, userNickname - {}", socketSessionId, user.getNickname());

        // 예상 대기 시간 전송
        Map<String, String> messageData = new HashMap<>();
        messageData.put("time", String.valueOf(time));
        WebSocketMessage message = new WebSocketMessage("expectedTime", messageData);
        TextMessage textMessage = new TextMessage(message.toJson());
        socketInfos.get(socketSessionId).getSession().sendMessage(textMessage);
    }

    @Scheduled(fixedDelay = 10_000L)  // 스케줄러 - 10초에 한번씩 수행
    @Transactional
    public void matchingUsers() {
        log.info("matchingUsers 실행 - (10초 주기)");
        // 먼저 들어온 여성 사용자들부터 순서대로 점수 계산, 가장 점수합이 높은 쌍부터 내보내기(기준 점수 50점)
        // 오래 대기하는 사용자들을 위한 가산점 -> 함수 한번 돌 떄마다 count++, 점수에 count 더해서 계산
        Iterator<String> iter = fQueue.iterator();
        while (iter.hasNext()) {
            String fSessionId = iter.next();
            User female = socketInfos.get(fSessionId).getUser();
            int maxScore = 0;
            String mSessionId = null;
            // ========= 이미 매칭된 상대는 매칭되지 않게 처리해야함 ============

            List<MatchingUser> femaleMatchingUserList = matchingUserRepository.findByUserId(female.getId());
            log.info("femaleUser - {}", female);
            log.info("femaleMatchingUserList - {}", femaleMatchingUserList);

            for (String mId : mQueue) {
                User male = socketInfos.get(mId).getUser();
                log.info("maleUser - {}", male);

                // 이미 만났거나 친구로 있을 경우 매칭되지 않게 처리 -- start
                boolean isMatched = false;
                for (MatchingUser femaleMatchingUser : femaleMatchingUserList) {
                    Optional<MatchingUser> byMatchingAndUser = matchingUserRepository.findMatchingExist(femaleMatchingUser.getMatching().getId(), male.getId());
                    if (byMatchingAndUser.isPresent()) {
                        isMatched = true;
                        break;
                    }
                }
                if (isMatched) continue;
                // 이미 만났거나 친구로 있을 경우 매칭되지 않게 처리 -- end

                int score = calculateScore(female, male) + calculateScore(male, female)
                        + socketInfos.get(fSessionId).getCount() + socketInfos.get(mId).getCount();

                if (score > maxScore) {
                    maxScore = score;
                    mSessionId = mId;
                }
            }

            // 임시 테스트 코드
//            maxScore = 100;
            // 임시 테스트 코드

            if (mSessionId != null && maxScore >= 50) {
                try {
                    WebSocketMessage message = new WebSocketMessage("findPair", null);
                    TextMessage textMessage = new TextMessage(message.toJson());

                    // 매칭된 사용자의 소켓에 메세지 보내기
                    socketInfos.get(fSessionId).getSession().sendMessage(textMessage);
                    socketInfos.get(mSessionId).getSession().sendMessage(textMessage);

                    // 대기큐에서 해당 사용자들 제거하고 수락 대기큐로 넣기
                    acceptQueue.add(fSessionId);
                    acceptQueue.add(mSessionId);
                    fQueue.remove(fSessionId);
                    mQueue.remove(mSessionId);

                    // 매칭 정보 몽고디비에 임시 저장
                    MatchingInfoDto matchingInfo = new MatchingInfoDto(fSessionId, mSessionId);
                    matchingInfoRepository.save(matchingInfo);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new CommonException(ExceptionType.OPENVIDU_ERROR);
                }
            }
        }

        for (String fId : fQueue) {
            socketInfos.get(fId).countUp();
        }
        for (String mId : mQueue) {
            socketInfos.get(mId).countUp();
        }
    }

    public User getUserAllData(Long userId) {
        log.info("getUserAllData 실행 - userId - {}", userId);
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
        if (mySmoking == null || yourSmoking == null) return 0;

        int score = 0;
        String yourSmokingName = yourSmoking.getName();

        switch (mySmoking.getName()) {
            case "비흡연":
                if (yourSmokingName.equals("비흡연")) score = 10;
                else score = 0;
                break;
            case "가끔 핌":
                if (yourSmokingName.equals("비흡연") || yourSmokingName.equals("가끔 핌")) score = 10;
                else if (yourSmokingName.equals("전자담배")) score = 7;
                else score = 2;
                break;
            case "자주 핌":
                score = 10;
                break;
            case "전자담배":
                if (yourSmokingName.equals("비흡연") || yourSmokingName.equals("전자담배")) score = 10;
                else if (yourSmokingName.equals("가끔 핌")) score = 7;
                else score = 2;
                break;
        }

//        System.out.println("smokingScore= " + score);
        return score;
    }

    private int drinkingScore(AdditionalInfo myDrinking, AdditionalInfo yourDrinking) {
        if (myDrinking == null || yourDrinking == null) return 0;

        int score = 0;
        String yourDrinkingName = yourDrinking.getName();

        switch (myDrinking.getName()) {
            case "안 마심":
                if (yourDrinkingName.equals("안 마심")) score = 10;
                else if (yourDrinkingName.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
            case "가끔 마심":
                if (yourDrinkingName.equals("가끔 마심")) score = 10;
                else score = 5;
                break;
            case "자주 마심":
                if (yourDrinkingName.equals("자주 마심")) score = 10;
                else if (yourDrinkingName.equals("가끔 마심")) score = 5;
                else score = 0;
                break;
        }

//        System.out.println("drinkingScore= " + score);
        return score;
    }

    private int religionScore(AdditionalInfo myReligion, AdditionalInfo yourReligion) {
        if (myReligion == null || yourReligion == null) return 0;

        if (myReligion.equals(yourReligion)) return 10;
        else return 0;
    }

    public int styleScore(User me, User you) {
        int score = 0;

        for (UserStyle userStyle : me.getUserStyles()) {
            AdditionalInfo addInfo = userStyle.getAdditionalInfo();
            switch (addInfo.getName()) {
                case "동갑":
                    if (me.getBirth().getYear() == you.getBirth().getYear()) score += 10;
                    break;
                case "연상":
                    if (me.getBirth().getYear() < you.getBirth().getYear()) score += 10;
                    break;
                case "연하":
                    if (me.getBirth().getYear() > you.getBirth().getYear()) score += 10;
                    break;
                case "같은 동네":
                    if (me.getRegion().equals(you.getRegion())) score += 10;
                    break;
                case "장거리":
                    if (!me.getRegion().equals(you.getRegion())) score += 10;
                    break;
                case "취미가 같은":
                    if (hasSameHobby(me.getUserHobbys(), you.getUserHobbys())) score += 10;
                    break;
                case "유사 직종":
                    if (me.getJobCode().equals(you.getJobCode())) score += 10;
                    break;
            }
        }

//        System.out.println("styleScore= " + score);
        return score;
    }

    private boolean hasSameHobby(List<UserHobby> myHobbys, List<UserHobby> yourHobbys) {
        // 하나라도 겹치는 취미가 있으면 true 반환
        for (UserHobby myhobby : myHobbys) {
            AdditionalInfo hobbyAddInfo = myhobby.getAdditionalInfo();
            for (UserHobby yourHobby : yourHobbys) {
                if (yourHobby.getAdditionalInfo().equals(hobbyAddInfo)) return true;
            }
        }

        return false;
    }

    public int mbtiScore(AdditionalInfo myMbti, AdditionalInfo yourMbti) {
        if (myMbti == null || yourMbti == null) return 0;

        int score = 0;
        String yourMbtiName = yourMbti.getName();

        switch (myMbti.getName()) {
            case "INFP":
                if (yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "ENFP":
                if (yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 4;
                break;
            case "INFJ":
                if (yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENTP")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP")) score = 16;
                else score = 4;
                break;
            case "ENFJ":
                if (yourMbtiName.equals("INFP") || yourMbtiName.equals("ISFP")) score = 20;
                else if (yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score = 16;
                else score = 4;
                break;
            case "INTJ":
                if (yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENTP")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score = 16;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 12;
                else score = 8;
                break;
            case "ENTJ":
                if (yourMbtiName.equals("INFP") || yourMbtiName.equals("INTP")) score = 20;
                else if (yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("INTJ") ||
                        yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ENTP")) score = 16;
                else score = 12;
                break;
            case "INTP":
                if (yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESTJ")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("INFJ") || yourMbtiName.equals("ENFJ") ||
                        yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score = 16;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 12;
                else score = 8;
                break;
            case "ENTP":
                if (yourMbtiName.equals("INFJ") || yourMbtiName.equals("INTJ")) score = 20;
                else if (yourMbtiName.equals("INFP") || yourMbtiName.equals("ENFP") || yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ENTJ") ||
                        yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP")) score = 16;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 12;
                else score = 8;
                break;
            case "ISFP":
                if (yourMbtiName.equals("ENFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ"))
                    score = 20;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 12;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 8;
                else score = 4;
                break;
            case "ESFP":
                if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 20;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 12;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 8;
                else score = 4;
                break;
            case "ISTP":
                if (yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 20;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 12;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 8;
                else score = 4;
                break;
            case "ESTP":
                if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ISTJ")) score = 20;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP") ||
                        yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ESTJ")) score = 12;
                else if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("ESTP"))
                    score += 8;
                else score = 4;
                break;
            case "ISFJ":
                if (yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score = 20;
                else if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ"))
                    score = 16;
                else if (yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP"))
                    score += 12;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score += 8;
                else score = 4;
                break;
            case "ESFJ":
                if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP")) score = 20;
                else if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ"))
                    score = 16;
                else if (yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP"))
                    score += 12;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score += 8;
                else score = 4;
                break;
            case "ISTJ":
                if (yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP")) score = 20;
                else if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ"))
                    score = 16;
                else if (yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP"))
                    score += 12;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("INTP") || yourMbtiName.equals("ENTP"))
                    score += 8;
                else score = 4;
                break;
            case "ESTJ":
                if (yourMbtiName.equals("ISFP") || yourMbtiName.equals("ISTP") || yourMbtiName.equals("INTP"))
                    score = 20;
                else if (yourMbtiName.equals("ISFJ") || yourMbtiName.equals("ESFJ") || yourMbtiName.equals("ISTJ") || yourMbtiName.equals("ESTJ"))
                    score = 16;
                else if (yourMbtiName.equals("ENTJ") || yourMbtiName.equals("ESFP") || yourMbtiName.equals("ESTP"))
                    score += 12;
                else if (yourMbtiName.equals("INTJ") || yourMbtiName.equals("ENTP")) score += 8;
                else score = 4;
                break;
        }

//        System.out.println("mbtiScore= " + score);
        return score;
    }

    public void finishWaiting(String socketSessionId) throws IOException {
        // 매칭 수락 대기 큐에 있던 세션이 연결이 끊긴 경우 상대방에게 알리기
        if (acceptQueue.contains(socketSessionId)) {
            acceptQueue.remove(socketSessionId);

            User user = socketInfos.get(socketSessionId).getUser();
            MatchingInfoDto matchingInfo;

            if (user.getGender().equals("F")) {
                matchingInfo = matchingInfoRepository.findBySocketSessionIdFAndIsValidateTrue(socketSessionId)
                        .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
            } else {
                matchingInfo = matchingInfoRepository.findBySocketSessionIdMAndIsValidateTrue(socketSessionId)
                        .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
            }

            WebSocketMessage message = new WebSocketMessage("matchingFail", null);
            TextMessage textMessage = new TextMessage(message.toJson());
            String pairSessionId = user.getGender().equals("F") ? matchingInfo.getSocketSessionIdM() : matchingInfo.getSocketSessionIdF();
            socketInfos.get(pairSessionId).getSession().sendMessage(textMessage);

            // 상대방은 다시 대기열로 넣어주기
            acceptQueue.remove(pairSessionId);
            if (user.getGender().equals("F")) mQueue.add(pairSessionId);
            else fQueue.add(pairSessionId);

            matchingInfo.setIsValidate(false);
            matchingInfoRepository.save(matchingInfo);
        }

        if (fQueue.contains(socketSessionId)) fQueue.remove(socketSessionId);
        if (mQueue.contains(socketSessionId)) mQueue.remove(socketSessionId);

        socketInfos.remove(socketSessionId);
    }

    public void acceptMatching(String socketSessionId) throws IOException {
        User user = socketInfos.get(socketSessionId).getUser();
        MatchingInfoDto matchingInfo;

        if (user.getGender().equals("F")) {
            matchingInfo = matchingInfoRepository.findBySocketSessionIdFAndIsValidateTrue(socketSessionId)
                    .orElseThrow(() -> new CommonException(ExceptionType.SOCKET_SESSION_NOT_FOUND));
            matchingInfo.setIsAcceptF(true);
        } else {
            matchingInfo = matchingInfoRepository.findBySocketSessionIdMAndIsValidateTrue(socketSessionId)
                    .orElseThrow(() -> new CommonException(ExceptionType.SOCKET_SESSION_NOT_FOUND));
            matchingInfo.setIsAcceptM(true);
        }
        matchingInfoRepository.save(matchingInfo);

        log.info("matchingInfo = {}", matchingInfo);

        // 두 사용자 모두 수락을 선택한 경우 - 매칭 성사
        if (matchingInfo.getIsAcceptF() != null && matchingInfo.getIsAcceptM() != null &&
                matchingInfo.getIsAcceptF() && matchingInfo.getIsAcceptM()) {
            String pairSocketSessionId = user.getGender().equals("F") ? matchingInfo.getSocketSessionIdM() : matchingInfo.getSocketSessionIdF();

            // DB에 매칭 정보 저장 (matching, matching_user 테이블)
            Matching matching = matchingRepository.save(new Matching());
            matchingUserRepository.save(new MatchingUser(matching, user));
            matchingUserRepository.save(new MatchingUser(matching, socketInfos.get(pairSocketSessionId).getUser()));

            // 매칭 질문 생성하여 저장
//            Question[] questions = getQuestions();
            Question[] questions = getStaticQuestions();
            List<MatchingQuestion> matchingQuestions = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                matchingQuestions.add(new MatchingQuestion(matching, questions[i], i + 1));
            }
            matchingQuestionRepository.saveAll(matchingQuestions);

            // 사용자들에게 openvidu 토큰값과 matchingId 반환
            Map<String, String> messageData1 = new HashMap<>();
            Map<String, String> messageData2 = new HashMap<>();
            try {
                String openViduSessionId = openViduService.initializeSession().getSessionId();  // openvidu 세션 생성
                messageData1.put("token", openViduService.createConnection(openViduSessionId));
                messageData2.put("token", openViduService.createConnection(openViduSessionId));
                messageData1.put("matchingId", matching.getId().toString());
                messageData2.put("matchingId", matching.getId().toString());
            } catch (Exception e) {
                e.printStackTrace();
                throw new CommonException(ExceptionType.OPENVIDU_ERROR);
            }

            WebSocketMessage webSocketMessage1 = new WebSocketMessage("matchingSuccess", messageData1);
            WebSocketMessage webSocketMessage2 = new WebSocketMessage("matchingSuccess", messageData2);
            socketInfos.get(socketSessionId).getSession().sendMessage(new TextMessage(webSocketMessage1.toJson()));
            socketInfos.get(pairSocketSessionId).getSession().sendMessage(new TextMessage(webSocketMessage2.toJson()));

            // 대기큐에서 사용자들 삭제
            acceptQueue.remove(socketSessionId);
            acceptQueue.remove(pairSocketSessionId);

            matchingInfo.setIsValidate(false);
            matchingInfoRepository.save(matchingInfo);
        }
    }

    public void rejectMatching(String socketSessionId) throws IOException {
        User user = socketInfos.get(socketSessionId).getUser();
        MatchingInfoDto matchingInfo;

        if (user.getGender().equals("F")) {
            matchingInfo = matchingInfoRepository.findBySocketSessionIdFAndIsValidateTrue(socketSessionId)
                    .orElseThrow(() -> new CommonException(ExceptionType.SOCKET_SESSION_NOT_FOUND));
        } else {
            matchingInfo = matchingInfoRepository.findBySocketSessionIdMAndIsValidateTrue(socketSessionId)
                    .orElseThrow(() -> new CommonException(ExceptionType.SOCKET_SESSION_NOT_FOUND));
        }

        String pairSocketSessionId = user.getGender().equals("F") ? matchingInfo.getSocketSessionIdM() : matchingInfo.getSocketSessionIdF();

        // 매칭 실패 메세지 전송
        WebSocketMessage webSocketMessage = new WebSocketMessage("matchingFail", null);
        socketInfos.get(pairSocketSessionId).getSession().sendMessage(new TextMessage(webSocketMessage.toJson()));

        // 수락 대기열에서 삭제하고, 거절한 상대 사용자만 다시 대기열로 넣어주기
        acceptQueue.remove(socketSessionId);
        acceptQueue.remove(pairSocketSessionId);
        if (user.getGender().equals("F")) {
//            fQueue.add(socketSessionId);
            mQueue.add(pairSocketSessionId);
        } else {
            fQueue.add(pairSocketSessionId);
//            mQueue.add(socketSessionId);
        }

        matchingInfo.setIsValidate(false);
        matchingInfoRepository.save(matchingInfo);
    }


    public Question[] getStaticQuestions() {
        List<Question> selectedQuestions = new ArrayList<>();
        Question question = questionRepository.findById(6L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(12L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(50L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(17L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(63L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(57L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(91L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(34L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(3L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);
        question = questionRepository.findById(5L).orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));
        selectedQuestions.add(question);

        Question[] questions = new Question[10];
        for (int i = 0; i < 10; i++) {
            questions[i] = selectedQuestions.get(i);
        }

        return questions;
    }

    public Question[] getQuestions() {
        List<Question> selectedQuestions = new ArrayList<>();

        // 필수 카드 3개 임의로 뽑기
        List<Question> essentialQuestions = questionRepository.findAllByCategory(QuestionType.ESSENTIAL);
        boolean[] isSelected = new boolean[essentialQuestions.size()];
        int cnt = 0;

        while (cnt < 3) {
            int number = (int) (Math.random() * essentialQuestions.size());
            if (!isSelected[number]) {
                selectedQuestions.add(essentialQuestions.get(number));
                isSelected[number] = true;
                cnt++;
            }
        }

        // 랜덤 카드 7개 임의로 뽑기
        // 연애 2개
        List<Question> loveQuestions = questionRepository.findAllByCategory(QuestionType.LOVE);
        isSelected = new boolean[loveQuestions.size()];
        cnt = 0;
        while (cnt < 2) {
            int number = (int) (Math.random() * loveQuestions.size());
            if (!isSelected[number]) {
                selectedQuestions.add(loveQuestions.get(number));
                isSelected[number] = true;
                cnt++;
            }
        }
        // 생활 1개
        selectRandomQuestion(
                questionRepository.findAllByCategory(QuestionType.LIFE), selectedQuestions
        );
        // 취미 1개
        selectRandomQuestion(
                questionRepository.findAllByCategory(QuestionType.HOBBY), selectedQuestions
        );
        // 최애 1개
        selectRandomQuestion(
                questionRepository.findAllByCategory(QuestionType.FAVORITE), selectedQuestions
        );
        // 호불호 1개
        selectRandomQuestion(
                questionRepository.findAllByCategory(QuestionType.PREFER), selectedQuestions
        );
        // vs 1개
        selectRandomQuestion(
                questionRepository.findAllByCategory(QuestionType.VS), selectedQuestions
        );

        // 순서 섞기
        Collections.shuffle(selectedQuestions);
        Question[] questions = new Question[10];
        for (int i = 0; i < 10; i++) {
            questions[i] = selectedQuestions.get(i);
        }

        return questions;
    }

    public void selectRandomQuestion(List<Question> curQuestions, List<Question> selectedQuestions) {
        int number = (int) (Math.random() * curQuestions.size());
        selectedQuestions.add(curQuestions.get(number));
    }

    private int calcAdditionalInfo(User user) {
        int addTime = 80;
        if (user.getJobCode() != null) {
            addTime -= 10;
        }
        if (user.getDrinkingCode() != null) {
            addTime -= 10;
        }
        if (user.getReligionCode() != null) {
            addTime -= 10;
        }
        if (user.getMbtiCode() != null) {
            addTime -= 10;
        }
        if (user.getSmokingCode() != null) {
            addTime -= 10;
        }
        if (user.getUserHobbys() != null && user.getUserHobbys().size() != 0) {
            addTime -= 10;
        }
        if (user.getUserStyles() != null && user.getUserStyles().size() != 0) {
            addTime -= 10;
        }
        if (user.getUserPersonalities() != null && user.getUserPersonalities().size() != 0) {
            addTime -= 10;
        }

        return addTime;
    }
}
