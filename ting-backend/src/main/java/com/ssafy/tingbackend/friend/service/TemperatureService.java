package com.ssafy.tingbackend.friend.service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.language.v1.*;
import com.google.cloud.language.v1.Document.Type;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import com.ssafy.tingbackend.friend.repository.ChattingMessageRepository;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@EnableAsync
public class TemperatureService {

    @Value("${cloud.gcp.credentials.location}")
    private Resource serviceKeyPath;

    private final ChattingRepository chattingRepository;
    private final ChattingMessageRepository chattingMessageRepository;

    @Scheduled(fixedDelay = 10_800_000L)  // 스케줄러 - 3시간에 한번씩 수행
    @Transactional
    @Async
    public void updateTeperature() throws IOException {
        log.info("채팅방 온도 업데이트");

        // 전체 채팅방에 대해 온도 재계산
        List<Chatting> chattingList = chattingRepository.findAllByState(ChattingType.ALIVE);
        LocalDateTime now = LocalDateTime.now();

        for(Chatting chatting : chattingList) {
            // 마지막 대화가 3일이 넘었는데 상태가 ALIVE인 경우 상태 DEAD로 바꿔주기
            Duration chattingDuration;
            if(chatting.getLastChattingTime() != null) chattingDuration = Duration.between(now, chatting.getLastChattingTime());
            else chattingDuration = Duration.between(now, chatting.getCreatedTime());

            if(chattingDuration.getSeconds() > 259200) chatting.setState(ChattingType.DEAD);  // 259200초=3일

            List<ChattingMessageDto> chattingMessages =
                    chattingMessageRepository.findAllByChattingIdOrderBySendTimeDesc(chatting.getId());
            if(chattingMessages.size() == 0) continue;
            
            String messagesText = "";
            int count = 1;  // 채팅을 주고받은 횟수 (메세지 보낸 사용자가 바뀌는 경우 +1)
            Long userId = chattingMessages.get(0).getUserId();
            for(ChattingMessageDto message : chattingMessages) {
                Duration messageDuration = Duration.between(now, message.getSendTime());
                if(messageDuration.getSeconds() > 10800) break;  // 3시간 이전에 보낸 메세지면 그만 보기

                if(message.getUserId() != userId) {
                    count++;
                    userId = message.getUserId();
                }
                messagesText += message.getContent() + " ";
            }

            // 3시간 동안 주고받은 메세지가 하나도 없는 경우 온도-0.2
            if(messagesText.length() == 0) {
                chatting.changeTemperature(new BigDecimal("-0.2"));
                continue;
            }

            double temperatureDiff = 0.0;

            // 감정 점수에 대한 온도 반영
            BigDecimal sentimentScore = analyzeMessage(messagesText);
            if(sentimentScore.compareTo(new BigDecimal("-0.2")) <= 0 &&
                sentimentScore.compareTo(new BigDecimal("-0.5")) > 0) {
                temperatureDiff += -0.1;
            } else if(sentimentScore.compareTo(new BigDecimal("-0.5")) <= 0) {
                temperatureDiff += -0.2;
            } else if(sentimentScore.compareTo(new BigDecimal("0.2")) >= 0 &&
                    sentimentScore.compareTo(new BigDecimal("0.5")) < 0) {
                temperatureDiff += 0.1;
            } else if(sentimentScore.compareTo(new BigDecimal("0.5")) >= 0) {
                temperatureDiff += 0.2;
            }

            // 채팅 빈도에 대한 온도 반영
            count /= 2;
            if(count == 0) {
                temperatureDiff += -0.2;
            } else if(count == 1 || count == 2) {
                temperatureDiff += -0.1;
            } else if(count >= 6 && count <= 10) {
                temperatureDiff += 0.1;
            } else if(count >= 10) {
                temperatureDiff += 0.2;
            }

            chatting.changeTemperature(new BigDecimal(temperatureDiff));
        }
    }

    public BigDecimal analyzeMessage(String text) throws IOException {
        // 인증 키 파일을 사용하여 Credentials 객체 생성
        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceKeyPath.getInputStream());

        // Instantiate the Language client com.google.cloud.language.v1.LanguageServiceClient
        try (LanguageServiceClient language = LanguageServiceClient.create(LanguageServiceSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build())) {
            Document doc = Document.newBuilder().setContent(text).setType(Type.PLAIN_TEXT).build();
            AnalyzeSentimentResponse response = language.analyzeSentiment(doc);
            Sentiment sentiment = response.getDocumentSentiment();

            if (sentiment == null) return BigDecimal.ZERO;
            return new BigDecimal(sentiment.getScore());
        }
    }

}
