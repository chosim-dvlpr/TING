package com.ssafy.tingbackend.chatting.service;

import com.ssafy.tingbackend.chatting.dto.MessageRequestDto;
import com.ssafy.tingbackend.chatting.dto.StompDestination;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import com.ssafy.tingbackend.friend.repository.ChattingMessageRepository;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChattingService {
    private final SimpMessagingTemplate template;
    private final ChattingMessageRepository chattingMessageRepository;
    private final ChattingUserRepository chattingUserRepository;
    private final ChattingRepository chattingRepository;
    private final UserRepository userRepository;
    private final StompDestination destination = new StompDestination();
    private final MessageRequestDto curMessage = new MessageRequestDto();

    @Transactional
    public void convertAndSendMessage(Long roomId, Long userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        String nickname = user.getNickname();
        ChattingMessageDto chattingMessageDto = new ChattingMessageDto(roomId, userId, content, nickname);

        ChattingUser friendChattingUser =  chattingUserRepository.findFriendChattingUser(roomId, userId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_USER_NOT_FOUND));

//        ChattingMessageDto chattingMessageDto = new ChattingMessageDto(roomId, userId, content, "닉네임임시");//테스트
//        template.convertAndSend("/subscription/list/1", chattingMessageDto); // 테스트용

        Chatting chatting = chattingRepository.findById(roomId)
                        .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_NOT_FOUND));
        if(chatting.getState().equals(ChattingType.ALIVE)) {
//            template.convertAndSend("/subscription/list/" + userId, chattingMessageDto);
            template.convertAndSend("/subscription/list/" + friendChattingUser.getUser().getId(), chattingMessageDto);
            template.convertAndSend("/subscription/chat/room/" + roomId, chattingMessageDto);

            chattingMessageRepository.save(chattingMessageDto);

            friendChattingUser.setUnread(friendChattingUser.getUnread()+1);
            chatting.setLastChattingContent(content);
            chatting.setLastChattingTime(LocalDateTime.now());
        }

    }

    @Transactional
    public void resetUnread(Long roomId, Long userId) {
        ChattingUser chattingUser = chattingUserRepository.findByRoomAndUser(roomId, userId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_USER_NOT_FOUND));
        chattingUser.setUnread(0);
        chattingUserRepository.save(chattingUser);
    }

    public void enter(MessageRequestDto messageRequestDto) {
        destination.setLastDestination("list");
        destination.setRoomLast(false);
        curMessage.setUserId(messageRequestDto.getUserId());
        curMessage.setRoomId(messageRequestDto.getRoomId());
        resetUnread(messageRequestDto.getRoomId(), messageRequestDto.getUserId());
    }

    public void quit(MessageRequestDto messageRequestDto) {
        destination.setLastDestination("room");
        destination.setRoomLast(true);
        resetUnread(messageRequestDto.getRoomId(), messageRequestDto.getUserId());
    }

    public void checkAndReset() {
        if(destination.isRoomLast()) {
            resetUnread(curMessage.getRoomId(), curMessage.getUserId());
        }
    }

    public Map<String, Object> chattingList(Long chattingId) {
        Map<String, Object> result = new HashMap<>();
        List<ChattingMessageDto> chattingMessageList = chattingMessageRepository.findAllByChattingIdOrderBySendTimeAsc(chattingId);
        result.put("chattingList", chattingMessageList);
        result.put("temperature", chattingRepository.findTemperatureById(chattingId));
        return result;
    }

    public void deleteMessages() {
        LocalDateTime deleteTime = LocalDateTime.of(2023, 8, 2, 16, 0, 0);

        List<ChattingMessageDto> data = chattingMessageRepository.findBySendTimeGreaterThan (deleteTime);
        System.out.println(data);
//        chattingMessageRepository.deleteAll(data);
    }
}
