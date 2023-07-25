package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.UserPersonality;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPersonalityRepository extends JpaRepository<UserPersonality, Long> {
}
