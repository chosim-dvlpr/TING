package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.UserPersonality;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPersonalityRepository extends JpaRepository<UserPersonality, Long> {
    @EntityGraph(attributePaths = {"additionalInfo"})
    List<UserPersonality> findAllByUserId(Long userId);
}
