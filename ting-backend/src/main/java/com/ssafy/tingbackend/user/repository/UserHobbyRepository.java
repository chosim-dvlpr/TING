package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.UserHobby;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHobbyRepository extends JpaRepository<UserHobby, Long> {
    @EntityGraph(attributePaths = {"additionalInfo"})
    List<UserHobby> findAllByUserId(Long userId);
}
