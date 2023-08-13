package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.board.CommentLike;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    @Query("SELECT c FROM CommentLike c WHERE c.user=:user AND c.comment=:comment")
    Optional<CommentLike> find(User user, Comment comment);

    @Query("SELECT c.comment.id FROM CommentLike c WHERE c.user.id=:userId AND c.comment.id=:commentId")
    Long findByCommentAndUser(Long commentId, Long userId);
}
