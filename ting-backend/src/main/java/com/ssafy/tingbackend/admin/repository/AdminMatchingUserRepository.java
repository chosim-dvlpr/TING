package com.ssafy.tingbackend.admin.repository;

import com.ssafy.tingbackend.entity.matching.MatchingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AdminMatchingUserRepository extends JpaRepository<MatchingUser, Long> {

    @Query("SELECT m FROM MatchingUser m JOIN FETCH m.user WHERE m.matching.id = :typeId AND m.user.id != :id")
    Optional<MatchingUser> findByMatchingAndNotUser(Long typeId, Long id);
}
