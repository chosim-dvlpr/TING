package com.ssafy.tingbackend.friend.repository;

import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChattingUserRepository extends JpaRepository<ChattingUser, Long> {
    @Query("SELECT c FROM ChattingUser c WHERE c.user=:user")
    List<ChattingUser> findAllByUser(User user);

    @Query("SELECT c.user FROM ChattingUser c WHERE c.chatting.id=:chattingId AND c.user.id !=:userId")
    User findFriend(Long chattingId, Long userId);

    @Query("SELECT c.chatting.id FROM ChattingUser c WHERE c.user=:user")
    List<Long> findChattingIdByUser(User user);

    @Query("SELECT c.unread FROM ChattingUser c WHERE c.chatting.id=:chattingId AND c.user.id=:userId")
    Integer findUnread(Long chattingId, Long userId);

    @Query("SELECT c FROM ChattingUser c WHERE c.chatting.id=:chattingId AND c.user.id=:userId")
    Optional<ChattingUser> findByRoomAndUser(Long chattingId, Long userId);

    @Query("SELECT c FROM ChattingUser c WHERE c.chatting.id=:chattingId AND c.user.id !=:userId")
    Optional<ChattingUser> findFriendChattingUser(Long chattingId, Long userId);
}
