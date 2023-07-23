package com.ssafy.tingbackend.auth.repository;

import com.ssafy.tingbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

}
