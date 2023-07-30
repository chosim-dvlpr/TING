package com.ssafy.tingbackend.friend.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.dto.ChattingDto;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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

        List<ChattingUser> chattingUserList = chattingUserRepository.findAllByUser(user);
        List<Chatting> chattingList = new ArrayList<>();
        for(ChattingUser chattingUser: chattingUserList) {
            chattingList.add(chattingRepository.findById(chattingUser.getChatting().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.CHATTING_NOT_FOUND)));
        }
        // 정렬 마지막 메세지 기준으로==============================
//        chattingList.sort();

        List<ChattingDto> chattingDtoList = new ArrayList<>();
        for(Chatting chatting: chattingList) {
            User friend = chattingUserRepository.findFriend(chatting.getId(), userId);
            chattingDtoList.add(ChattingDto.of(chatting, friend));
        }

        return chattingDtoList;
    }
}
