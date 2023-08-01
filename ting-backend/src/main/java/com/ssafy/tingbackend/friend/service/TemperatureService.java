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

//    @Scheduled(fixedDelay = 10_800_000L)  // 스케줄러 - 3시간에 한번씩 수행
    @Transactional
    @Async
    public void updateTeperature() throws IOException {
        // 전체 채팅방에 대해 온도 재계산
        List<Chatting> chattingList = chattingRepository.findAllByState(ChattingType.ALIVE);
        LocalDateTime now = LocalDateTime.now();

        for(Chatting chatting : chattingList) {
            List<ChattingMessageDto> chattingMessages = chattingMessageRepository.findAllByChattingId(chatting.getId());
            String messagesText = "";
            for(ChattingMessageDto message : chattingMessages) {
                Duration duration = Duration.between(now, message.getSendTime());
                if(duration.getSeconds() <= 10800) messagesText += message.getContent() + " ";
            }

            BigDecimal sentimentScore = analyzeEntities(messagesText);
            chatting.changeTemperature(sentimentScore);
        }
    }

    public BigDecimal analyzeEntities(String text) throws IOException {
        // 인증 키 파일을 사용하여 Credentials 객체 생성
        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceKeyPath.getInputStream());

        // Instantiate the Language client com.google.cloud.language.v1.LanguageServiceClient
        try (LanguageServiceClient language = LanguageServiceClient.create(LanguageServiceSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build())) {
            Document doc = Document.newBuilder().setContent(text).setType(Type.PLAIN_TEXT).build();
            AnalyzeSentimentResponse response = language.analyzeSentiment(doc);
            Sentiment sentiment = response.getDocumentSentiment();
//            if (sentiment == null) {
//                System.out.println("No sentiment found");
//            } else {
//                System.out.printf("Sentiment magnitude: %.3f\n", sentiment.getMagnitude());
//                System.out.printf("Sentiment score: %.3f\n", sentiment.getScore());
//            }

            return new BigDecimal(String.format("%.1f", sentiment.getScore()));
        }
    }

}
