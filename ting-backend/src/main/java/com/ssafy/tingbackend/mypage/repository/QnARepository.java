package com.ssafy.tingbackend.mypage.repository;

import com.ssafy.tingbackend.entity.QnA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QnARepository extends JpaRepository<QnA, Long> {
    List<QnA> findAllByUserId(Long userId);
    Page<QnA> findByUserId(Long userId, Pageable pageable);
}
