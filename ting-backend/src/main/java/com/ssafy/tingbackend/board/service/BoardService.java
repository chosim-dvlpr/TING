package com.ssafy.tingbackend.board.service;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.board.dto.IssueBoardDto;
import com.ssafy.tingbackend.board.repository.AdviceBoardRepository;
import com.ssafy.tingbackend.board.repository.IssueBoardRepository;
import com.ssafy.tingbackend.board.repository.IssueVoteRepository;
import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.board.IssueVote;
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
}
