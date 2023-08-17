package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IssueBoardRepository extends JpaRepository<IssueBoard, Long> {
    @Query("SELECT i FROM IssueBoard i WHERE i.isRemoved=false")
    Page<IssueBoard> findList(Pageable pageable);

    Page<IssueBoard> findAllByUserIdAndIsRemovedFalse(Long userId, PageRequest pageRequest);

    @Query("SELECT i FROM IssueBoard i WHERE i.isRemoved=false AND i.title Like %:keyword%")
    Page<IssueBoard> findByTitleContaining(String keyword, PageRequest pageRequest);
}
