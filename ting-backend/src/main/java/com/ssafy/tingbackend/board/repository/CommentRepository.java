package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.entity.board.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
