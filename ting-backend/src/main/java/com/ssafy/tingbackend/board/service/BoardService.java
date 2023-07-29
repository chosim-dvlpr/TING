package com.ssafy.tingbackend.board.service;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.board.dto.CommentPostDto;
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

    public void insertAdviceBoard(AdviceBoardDto adviceBoardDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        AdviceBoard adviceBoard = AdviceBoard.builder()
                .user(user)
                .title(adviceBoardDto.getTitle())
                .content(adviceBoardDto.getContent())
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
    public void modifyAdviceBoard(AdviceBoardDto adviceBoardDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        AdviceBoard adviceBoard = adviceBoardRepository.findById(adviceBoardDto.getId())
                .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));

        adviceBoard.setTitle(adviceBoardDto.getTitle());
        adviceBoard.setContent(adviceBoardDto.getContent());
    }

    @Transactional
    public AdviceBoardDto adviceDetail(Long adviceId) {
        AdviceBoard adviceBoard = adviceBoardRepository.findById(adviceId)
                .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
        User user = userRepository.findById(adviceBoard.getUser().getId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        adviceBoard.setHit(adviceBoard.getHit()+1);
        return AdviceBoardDto.of(adviceBoard, user);
    }

    public List<AdviceBoardDto> adviceList(int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo-1, 3, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<AdviceBoard> page = adviceBoardRepository.findList(pageRequest);
        List<AdviceBoard> adviceBoardList = page.getContent();
        List<AdviceBoardDto> adviceBoardDtoList = new ArrayList<>();
        for(AdviceBoard adviceBoard : adviceBoardList) {
            User user = userRepository.findById(adviceBoard.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            adviceBoardDtoList.add(AdviceBoardDto.of(adviceBoard, user));
        }

        return adviceBoardDtoList;
    }

    public void insertIssueBoard(IssueBoardDto issueBoardDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        IssueBoard issueBoard = IssueBoard.builder()
                .user(user)
                .title(issueBoardDto.getTitle())
                .content(issueBoardDto.getContent())
                .agreeTitle(issueBoardDto.getAgreeTitle())
                .opposeTitle(issueBoardDto.getOpposeTitle())
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
    public IssueBoardDto issueDetail(Long issueId) {
        IssueBoard issueBoard = issueBoardRepository.findById(issueId)
                .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
        User user = userRepository.findById(issueBoard.getUser().getId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        issueBoard.setHit(issueBoard.getHit()+1);
        return IssueBoardDto.of(issueBoard, user);
    }

    public List<IssueBoardDto> issueList(int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo-1, 3, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<IssueBoard> page = issueBoardRepository.findList(pageRequest);
        List<IssueBoard> issueBoardList = page.getContent();
        List<IssueBoardDto> issueBoardDtoList = new ArrayList<>();
        for(IssueBoard issueBoard : issueBoardList) {
            User user = userRepository.findById(issueBoard.getUser().getId())
                    .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
            issueBoardDtoList.add(IssueBoardDto.of(issueBoard, user));
        }

        return issueBoardDtoList;
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
    public void insertComment(CommentPostDto commentPostDto) {
        User user = userRepository.findById(commentPostDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Long boardId = commentPostDto.getBoardId();
        Comment comment = null;

        System.out.println("!!!!!!" + commentPostDto.getBoardType());

        Comment parentComment = null;
        if(commentPostDto.getDepth() == 1) {
            parentComment = commentRepository.findById(commentPostDto.getParentId())
                    .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));
        }

        if(commentPostDto.getBoardType().equals(BoardType.ADVICE)) {
            System.out.println("============ADVICE");
            AdviceBoard adviceBoard = adviceBoardRepository.findById(boardId)
                    .orElseThrow(() -> new CommonException(ExceptionType.ADVICE_BOARD_NOT_FOUND));
            comment = Comment.builder()
                    .boardType(commentPostDto.getBoardType())
                    .content(commentPostDto.getContent())
                    .depth(commentPostDto.getDepth())
                    .parent(parentComment)
                    .build();
            comment.setAdviceBoard(adviceBoard);
        } else if(commentPostDto.getBoardType().equals(BoardType.ISSUE)) {
            System.out.println("===========ISSUE");
            IssueBoard issueBoard = issueBoardRepository.findById(boardId)
                    .orElseThrow(() -> new CommonException(ExceptionType.ISSUE_BOARD_NOT_FOUND));
            comment = Comment.builder()
                    .boardType(commentPostDto.getBoardType())
                    .issueBoard(issueBoard)
                    .content(commentPostDto.getContent())
                    .depth(commentPostDto.getDepth())
                    .parent(parentComment)
                    .build();
            comment.setIssueBoard(issueBoard);
        }

        commentRepository.save(comment);
    }

    @Transactional
    public void modifyComment(CommentPostDto commentPostDto) {
        User user = userRepository.findById(commentPostDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentPostDto.getCommentId())
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        comment.setContent(commentPostDto.getContent());
    }

    @Transactional
    public void deleteComment(CommentPostDto commentPostDto) {
        userRepository.findById(commentPostDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentPostDto.getCommentId())
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
    public void deletelikeComment(Long commentId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_NOT_FOUND));

        CommentLike commentLike = commentLikeRepository.find(user, comment)
                .orElseThrow(() -> new CommonException(ExceptionType.COMMENT_LIKE_NOT_FOUND));

        commentLikeRepository.delete(commentLike);
        comment.setLikeCount(comment.getLikeCount()-1);
    }
}
