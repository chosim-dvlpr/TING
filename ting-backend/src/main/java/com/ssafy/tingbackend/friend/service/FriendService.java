package com.ssafy.tingbackend.friend.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.dto.ChattingDto;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.user.dto.AdditionalInfoDto;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {

    private final UserRepository userRepository;
    private final ChattingRepository chattingRepository;
    private final ChattingUserRepository chattingUserRepository;

    public List<ChattingDto> chattingList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<Long> chattingIdList = chattingUserRepository.findChattingIdByUser(user);
        List<Chatting> chattingList = new ArrayList<>();

        chattingList = chattingRepository.findAllByUser(chattingIdList);

        List<ChattingDto> chattingDtoList = new ArrayList<>();
        for(Chatting chatting: chattingList) {
            User friend = chattingUserRepository.findFriend(chatting.getId(), userId);
            chattingDtoList.add(ChattingDto.of(chatting, friend));
        }

        return chattingDtoList;
    }

    @Transactional
    public UserDto.Info friendInfo(Long userId) {
        User friend = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<AdditionalInfoDto> hobbyAdditional = new ArrayList<>();
        List<AdditionalInfoDto> styleAdditional = new ArrayList<>();
        List<AdditionalInfoDto> personalityAdditional = new ArrayList<>();

        friend.getUserHobbys().forEach(hobby -> hobbyAdditional.add(AdditionalInfoDto.of(hobby.getAdditionalInfo())));
        friend.getUserStyles().forEach(style -> styleAdditional.add(AdditionalInfoDto.of(style.getAdditionalInfo())));
        friend.getUserPersonalities().forEach(personality -> personalityAdditional.add(AdditionalInfoDto.of(personality.getAdditionalInfo())));
        return UserDto.Info.of(friend,hobbyAdditional, styleAdditional, personalityAdditional);
    }

    @Transactional
    public void aliveFriend(Long chattingId) {
        Chatting chatting = chattingRepository.findById(chattingId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_NOT_FOUND));

        chatting.setState(ChattingType.ALIVE);
    }

    @Transactional
    public void deleteFriend(Long chattingId) {
        Chatting chatting = chattingRepository.findById(chattingId)
                .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_NOT_FOUND));

        chatting.setState(ChattingType.DELETED);
        chatting.setRemoved(true);
        chatting.setRemovedTime(LocalDateTime.now());
    }
}
