package com.ssafy.tingbackend.friend.repository;

import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ChattingMessageRepository extends MongoRepository<ChattingMessageDto, String> {
    List<ChattingMessageDto> findAllByChattingIdOrderBySendTimeDesc(Long chattingId);
    List<ChattingMessageDto> findAllByChattingIdOrderBySendTimeAsc(Long chattingId);

    List<ChattingMessageDto> findBySendTimeGreaterThan(LocalDateTime deleteTime);
}
