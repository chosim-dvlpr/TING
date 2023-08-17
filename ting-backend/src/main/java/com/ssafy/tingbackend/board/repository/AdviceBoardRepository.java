package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdviceBoardRepository extends JpaRepository<AdviceBoard, Long> {
    @Query("SELECT a FROM AdviceBoard a WHERE a.isRemoved=false")
    Page<AdviceBoard> findList(Pageable pageable);

    @Query("SELECT a FROM AdviceBoard a WHERE a.isRemoved=false AND a.title Like %:keyword% ORDER BY a.modifiedTime DESC")
    Page<AdviceBoard> findByTitleContaining(String keyword, Pageable pageable);

    Page<AdviceBoard> findListByUserAndIsRemovedFalse(PageRequest pageRequest, User user);

    @Modifying
    @Query("UPDATE AdviceBoard a SET a.hit =:hit WHERE a.id=:id")
    void updateHit(@Param("hit") Long hit, @Param("id") Long id);
}
