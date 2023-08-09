package com.ssafy.tingbackend.board.repository;

import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.board.IssueVote;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IssueVoteRepository extends JpaRepository<IssueVote, Long> {
    @Query("SELECT i FROM IssueVote i WHERE i.user=:user AND i.issueBoard=:issueBoard")
    Optional<IssueVote> findVote(User user, IssueBoard issueBoard);
}
