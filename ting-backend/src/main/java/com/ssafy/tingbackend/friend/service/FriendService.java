package com.ssafy.tingbackend.friend.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.item.FishSkin;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.dto.ChattingDto;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.item.repository.FishSkinRepository;
import com.ssafy.tingbackend.user.dto.AdditionalInfoDto;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {

    private final UserRepository userRepository;
    private final ChattingRepository chattingRepository;
    private final ChattingUserRepository chattingUserRepository;
    private final FishSkinRepository fishSkinRepository;

    public List<ChattingDto> friendList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<Long> chattingIdList = chattingUserRepository.findChattingIdByUser(user);
        List<Chatting> chattingList = new ArrayList<>();

        chattingList = chattingRepository.findAllByUser(chattingIdList);

        List<ChattingDto> chattingDtoList = new ArrayList<>();
        for (Chatting chatting : chattingList) {
            LocalDateTime lastChattingTime = chatting.getLastChattingTime() == null ? chatting.getCreatedTime() : chatting.getLastChattingTime();
            if (ChronoUnit.DAYS.between(lastChattingTime, LocalDateTime.now()) > 3) {
                if (ChronoUnit.DAYS.between(chatting.getLastChattingTime(), LocalDateTime.now()) > 7) {
                    chatting.setState(ChattingType.DELETED);
                    chatting.setRemoved(true);
                    chatting.setRemovedTime(LocalDateTime.now());

                    // 삭제된 친구는 반환하지 않음
                    chattingRepository.save(chatting);
                    continue;
                }
                chatting.setState(ChattingType.DEAD);
            }

            User friend = chattingUserRepository.findFriend(chatting.getId(), userId);
            Integer unread = chattingUserRepository.findUnread(chatting.getId(), userId);

            ChattingDto chattingDto = ChattingDto.of(chatting, friend, unread);
            if (chatting.getState() == ChattingType.DEAD) {
                FishSkin deadFishSkin = fishSkinRepository.findById(friend.getFishSkin().getCode() + 1000)
                        .orElseThrow();
                chattingDto.setFishSkin(deadFishSkin.getImagePath());
            }

            chattingDtoList.add(chattingDto);
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

        return UserDto.Info.of(friend, hobbyAdditional, styleAdditional, personalityAdditional);
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
