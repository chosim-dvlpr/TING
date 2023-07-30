package com.ssafy.tingbackend.friend.repository;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChattingRepository extends JpaRepository<Chatting, Long> {
//    @Query("SELECT a FROM AdviceBoard a WHERE a.isRemoved=false")
//    Page<AdviceBoard> findList(Pageable pageable);
}
