package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.board.dto.CommentDto;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.type.BoardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.adviceBoard.id=:boardId AND c.depth=0 AND " +
            " c.boardType=com.ssafy.tingbackend.entity.type.BoardType.ADVICE ORDER BY c.createdTime DESC")
    List<Comment> findAllAdvice(@Param("boardId") Long boardId);

    @Query("SELECT c FROM Comment c WHERE c.issueBoard.id=:boardId AND c.depth=0 AND " +
            " c.boardType=com.ssafy.tingbackend.entity.type.BoardType.ISSUE ORDER BY c.createdTime ASC")
    List<Comment> findAllIssue(Long boardId);

    @Query("SELECT c FROM Comment c WHERE c.adviceBoard.id=:boardId AND c.depth=1 AND c.parent.id=:commentId AND " +
            " c.boardType=com.ssafy.tingbackend.entity.type.BoardType.ADVICE ORDER BY c.createdTime ASC")
    List<Comment> findChildAdvice(Long boardId, Long commentId);

    @Query("SELECT c FROM Comment c WHERE c.issueBoard.id=:boardId AND c.depth=0 AND c.parent.id=:commentId AND " +
            " c.boardType=com.ssafy.tingbackend.entity.type.BoardType.ISSUE ORDER BY c.createdTime DESC")
    List<Comment> findChildIssue(Long boardId, Long commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.likeCount = c.likeCount+1  WHERE c.id=:commentId")
    void upLike(Long commentId);

    @Modifying
    @Query("UPDATE Comment c SET c.likeCount = c.likeCount-1  WHERE c.id=:commentId")
    void downLike(Long commentId);
}
