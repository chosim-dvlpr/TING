package com.ssafy.tingbackend.friend.repository;

import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChattingMessageRepository extends MongoRepository<ChattingMessageDto, String> {
    List<ChattingMessageDto> findAllByChattingIdOrderBySendTimeDesc(Long chattingId);
}
