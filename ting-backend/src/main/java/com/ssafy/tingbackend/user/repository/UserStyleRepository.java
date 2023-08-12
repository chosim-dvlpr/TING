package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.UserStyle;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStyleRepository extends JpaRepository<UserStyle, Long> {
    @EntityGraph(attributePaths = {"additionalInfo"})
    List<UserStyle> findAllByUserId(Long userId);
}
