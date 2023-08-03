package com.ssafy.tingbackend.board.service;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.board.dto.CommentDto;
import com.ssafy.tingbackend.board.dto.IssueBoardDto;
import com.ssafy.tingbackend.board.repository.*;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.board.*;
import com.ssafy.tingbackend.entity.type.BoardType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {
    private final UserRepository userRepository;
    private final AdviceBoardRepository adviceBoardRepository;
    private final IssueBoardRepository issueBoardRepository;
    private final IssueVoteRepository issueVoteRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    public void insertAdviceBoard(AdviceBoardDto.Request adviceBoardRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        AdviceBoard adviceBoard = AdviceBoard.builder()
                .user(user)
                .title(adviceBoardRequest.getTitle())
                .content(adviceBoardRequest.getContent())
                .build();

        adviceBoardRepository.save(adviceBoard);
    }

    @Transactional
    public void deleteAdviceBoard(Long adviceId, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        AdviceBoard adviceBoard = adviceBoardRepository.findById(adviceId)
                .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));

        adviceBoard.setRemoved(true);
        adviceBoard.setRemovedTime(LocalDateTime.now());
    }

    @Transactional
    public void modifyAdviceBoard(AdviceBoardDto.Request adviceBoardRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        AdviceBoard adviceBoard = adviceBoardRepository.findById(adviceBoardRequest.getAdviceId())
                .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));

        adviceBoard.setTitle(adviceBoardRequest.getTitle());
        adviceBoard.setContent(adviceBoardRequest.getContent());
    }

    @Transactional
    public AdviceBoardDto.Response adviceDetail(Long adviceId) {
        AdviceBoard adviceBoard = adviceBoardRepository.findById(adviceId)
                .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
        User user = userRepository.findById(adviceBoard.getUser().getId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        adviceBoard.setHit(adviceBoard.getHit()+1);
        return AdviceBoardDto.Response.of(adviceBoard, user);
    }

    public List<AdviceBoardDto.Response> adviceList(int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo-1, 3, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<AdviceBoard> page = adviceBoardRepository.findList(pageRequest);
        List<AdviceBoard> adviceBoardList = page.getContent();
        List<AdviceBoardDto.Response> adviceBoardDtoList = new ArrayList<>();
        for(AdviceBoard adviceBoard : adviceBoardList) {
            User user = userRepository.findById(adviceBoard.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            adviceBoardDtoList.add(AdviceBoardDto.Response.of(adviceBoard, user));
        }

        return adviceBoardDtoList;
    }

    public void insertIssueBoard(IssueBoardDto.Request issueBoardRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        IssueBoard issueBoard = IssueBoard.builder()
                .user(user)
                .title(issueBoardRequest.getTitle())
                .content(issueBoardRequest.getContent())
                .agreeTitle(issueBoardRequest.getAgreeTitle())
                .opposeTitle(issueBoardRequest.getOpposeTitle())
                .build();

        issueBoardRepository.save(issueBoard);
    }

    @Transactional
    public void deleteIssueBoard(Long issueId, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        IssueBoard issueBoard = issueBoardRepository.findById(issueId)
                .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));

        issueBoard.setRemoved(true);
        issueBoard.setRemovedTime(LocalDateTime.now());
    }

    @Transactional
    public IssueBoardDto.Response issueDetail(Long issueId) {
        IssueBoard issueBoard = issueBoardRepository.findById(issueId)
                .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
        User user = userRepository.findById(issueBoard.getUser().getId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        issueBoard.setHit(issueBoard.getHit()+1);
        return IssueBoardDto.Response.of(issueBoard, user);
    }

    public List<IssueBoardDto.Response> issueList(int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo-1, 3, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<IssueBoard> page = issueBoardRepository.findList(pageRequest);
        List<IssueBoard> issueBoardList = page.getContent();
        List<IssueBoardDto.Response> issueBoardResponseList = new ArrayList<>();
        for(IssueBoard issueBoard : issueBoardList) {
            User user = userRepository.findById(issueBoard.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            issueBoardResponseList.add(IssueBoardDto.Response.of(issueBoard, user));
        }

        return issueBoardResponseList;
    }

    @Transactional
    public void voteIssueBoard(Long issueId, Long userId, boolean isAgree) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        IssueBoard issueBoard = issueBoardRepository.findById(issueId)
                .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));

        if(issueVoteRepository.findVote(user, issueBoard).isPresent()) {
            IssueVote issueVote = issueVoteRepository.findVote(user, issueBoard).get();
            if(issueVote.isAgree()) issueBoard.setAgreeCount(issueBoard.getAgreeCount()-1);
            else issueBoard.setOpposeCount(issueBoard.getOpposeCount()-1);
            issueVoteRepository.delete(issueVote);
        }

        if(isAgree) issueBoard.setAgreeCount(issueBoard.getAgreeCount()+1);
        else issueBoard.setOpposeCount(issueBoard.getOpposeCount()+1);

        IssueVote issueVote = new IssueVote(user, issueBoard, isAgree);
        issueVoteRepository.save(issueVote);

    }

    @Transactional
    public void insertComment(CommentDto.Request commentRequest) {
        User user = userRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Long boardId = commentRequest.getBoardId();
        Comment comment = null;

        Comment parentComment = null;
        if(commentRequest.getDepth() == 1) {
            parentComment = commentRepository.findById(commentRequest.getParentId())
                    .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));
        }

        if(commentRequest.getBoardType().equals(BoardType.ADVICE)) {
            AdviceBoard adviceBoard = adviceBoardRepository.findById(boardId)
                    .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
            comment = Comment.builder()
                    .boardType(commentRequest.getBoardType())
                    .content(commentRequest.getContent())
                    .depth(commentRequest.getDepth())
                    .parent(parentComment)
                    .user(user)
                    .build();
            comment.setAdviceBoard(adviceBoard);
        } else if(commentRequest.getBoardType().equals(BoardType.ISSUE)) {
            IssueBoard issueBoard = issueBoardRepository.findById(boardId)
                    .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
            comment = Comment.builder()
                    .boardType(commentRequest.getBoardType())
                    .issueBoard(issueBoard)
                    .content(commentRequest.getContent())
                    .depth(commentRequest.getDepth())
                    .parent(parentComment)
                    .user(user)
                    .build();
            comment.setIssueBoard(issueBoard);
        }

        commentRepository.save(comment);
    }

    @Transactional
    public void modifyComment(CommentDto.Request commentRequest) {
        User user = userRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentRequest.getCommentId())
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        comment.setContent(commentRequest.getContent());
    }

    @Transactional
    public void deleteComment(CommentDto.Request commentRequest) {
        userRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentRequest.getCommentId())
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        comment.setRemoved(true);
        comment.setRemovedTime(LocalDateTime.now());
    }

    @Transactional
    public void likeComment(Long commentId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        if(commentLikeRepository.find(user, comment).isPresent()) return;

        CommentLike commentLike = CommentLike.builder()
                .user(user)
                .comment(comment)
                .build();

        comment.setLikeCount(comment.getLikeCount()+1);
        commentLikeRepository.save(commentLike);
    }

    @Transactional
    public void deleteLikeComment(Long commentId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        CommentLike commentLike = commentLikeRepository.find(user, comment)
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_LIKE_NOT_FOUND));

        commentLikeRepository.delete(commentLike);
        comment.setLikeCount(comment.getLikeCount()-1);
    }

    public List<CommentDto.Response> commentList(BoardType boardType, Long boardId) {
        List<Comment> commentList = new ArrayList<>();
        if(boardType.equals(BoardType.ADVICE)) {
            commentList = commentRepository.findAllAdvice(boardId);
        } else if(boardType.equals(BoardType.ISSUE)) {
            commentList = commentRepository.findAllIssue(boardId);
        }

        List<CommentDto.Response> commentDtoList = new ArrayList<>();
        for(Comment comment: commentList) {
            User user = userRepository.findById(comment.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            commentDtoList.add(CommentDto.Response.of(comment, user));
        }
        return commentDtoList;
    }

    public List<CommentDto.Response> commentChildList(BoardType boardType, Long boardId, Long commentId) {
        List<Comment> commentList = new ArrayList<>();
        if(boardType.equals(BoardType.ADVICE)) {
            commentList = commentRepository.findChildAdvice(boardId, commentId);
        } else if(boardType.equals(BoardType.ISSUE)) {
            commentList = commentRepository.findChildIssue(boardId, commentId);
        }

        List<CommentDto.Response> commentDtoList = new ArrayList<>();
        for(Comment comment: commentList) {
            User user = userRepository.findById(comment.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            commentDtoList.add(CommentDto.Response.of(comment, user));
        }
        return commentDtoList;
    }
}
