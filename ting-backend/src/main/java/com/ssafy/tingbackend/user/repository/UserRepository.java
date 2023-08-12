package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    @Query("SELECT u FROM User u where u.id=:id AND u.isRemoved = false")
    Optional<User> findByIdNotRemoved(Long id);

    @Query("SELECT u FROM User u WHERE u.email=:email AND u.isRemoved=false")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT u.email FROM User u WHERE u.name=:name AND u.phoneNumber=:phoneNumber AND u.isRemoved=false")
    Optional<String> findEmail(@Param("name") String name, @Param("phoneNumber") String phoneNumber);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.nickname=:nickname AND u.isRemoved=false")
    boolean isDuplicatedNickname(@Param("nickname") String nickname);

    @Query("SELECT u FROM User u WHERE u.name=:name AND u.phoneNumber=:phoneNumber AND u.email=:email AND u.isRemoved=false")
    Optional<User> findPassword(String name, String phoneNumber, String email);

    @Modifying
    @Query("UPDATE User u SET u.isRemoved = true, u.removedTime = :removedTime WHERE u.id = :userId")
    void softDeleteUser(@Param("userId") Long userId, @Param("removedTime") LocalDateTime removedTime);

    Optional<User> findByNickname(String keyword);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isRemoved = false")
    Integer findUserCount();

    @Query("SELECT u FROM User u WHERE u.isRemoved = false")
    List<User> findAllUsers();
}
