package com.ssafy.tingbackend.friend.repository;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.type.ChattingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ChattingRepository extends JpaRepository<Chatting, Long> {
    @Query("SELECT c FROM Chatting c WHERE c.isRemoved=false AND c.id IN (:chattingIdList) ORDER BY c.lastChattingTime DESC")
    List<Chatting> findAllByUser(List<Long> chattingIdList);

    List<Chatting> findAllByState(ChattingType state);

    @Query("SELECT c.temperature FROM Chatting c WHERE c.id=:chattingId")
    BigDecimal findTemperatureById(Long chattingId);
}
