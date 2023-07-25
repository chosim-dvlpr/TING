package com.ssafy.tingbackend.user.repository;

import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);

    @Query("SELECT u.email FROM User u WHERE u.name=:name AND u.phoneNumber=:phoneNumber AND u.isRemoved=false")
    Optional<String> findEmail(@Param("name") String name, @Param("phoneNumber") String phoneNumber);
}
