package com.ssafy.tingbackend.board.controller;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.board.dto.CommentPostDto;
import com.ssafy.tingbackend.board.dto.IssueBoardDto;
import com.ssafy.tingbackend.board.service.BoardService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;

    /**
     * 상담 게시글 작성 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param adviceBoardDto title, content
     * @return Only code and message
     */
    @PostMapping("/advice")
    public CommonResponse writeAdvice(@RequestBody AdviceBoardDto adviceBoardDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.insertAdviceBoard(adviceBoardDto, userId);
        return new CommonResponse(200, "상담글 작성 성공");
    }

    /**
     * 상담 게시글 삭제 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param adviceId
     * @return Only code and message
     */
    @DeleteMapping("/advice/{adviceId}")
    public CommonResponse deleteAdvice(@PathVariable Long adviceId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.deleteAdviceBoard(adviceId, userId);
        return new CommonResponse(200, "상담글 삭제 성공");
    }

    /**
     * 상담 게시글 수정 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param adviceBoardDto title, content
     * @return Only code and message
     */
    @PutMapping("/advice/{adviceId}")
    public CommonResponse modifyAdvice(@PathVariable Long adviceId, @RequestBody AdviceBoardDto adviceBoardDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        adviceBoardDto.setId(adviceId);
        boardService.modifyAdviceBoard(adviceBoardDto, userId);
        return new CommonResponse(200, "상담글 수정 성공");
    }

    /**
     * 상담 상세 조회 API
     * @param adviceId
     * @return 상담 상세 정보
     */
    @GetMapping("/advice/{adviceId}")
    public DataResponse<AdviceBoardDto> detailQuestion(@PathVariable Long adviceId) {
        AdviceBoardDto adviceBoardDto = boardService.adviceDetail(adviceId);
        return new DataResponse<>(200, "상담글 상세 조회 성공", adviceBoardDto);
    }

    /**
     * 상담 목록 조회 API
     * @param pageNo
     * @return 문의 목록 리스트
     */
    @GetMapping("/advice")
    public DataResponse<List<AdviceBoardDto>> listQuestion(@RequestParam("pageNo") int pageNo) {
        List<AdviceBoardDto> adviceList = boardService.adviceList(pageNo);
        return new DataResponse<>(200, "문의글 목록 조회 성공", adviceList);
    }


    /**
     * 이슈 게시글 작성 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param issueBoardDto title, content, agreeTitle, opposeTitle
     * @return Only code and message
     */
    @PostMapping("/issue")
    public CommonResponse writeIssue(@RequestBody IssueBoardDto issueBoardDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.insertIssueBoard(issueBoardDto, userId);
        return new CommonResponse(200, "이슈글 작성 성공");
    }

    /**
     * 이슈 게시글 삭제 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param issueId
     * @return Only code and message
     */
    @DeleteMapping("/issue/{issueId}")
    public CommonResponse deleteIssue(@PathVariable Long issueId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.deleteIssueBoard(issueId, userId);
        return new CommonResponse(200, "이슈글 삭제 성공");
    }

    /**
     * 이슈 상세 조회 API
     * @param issueId
     * @return 이슈 상세 정보
     */
    @GetMapping("/issue/{issueId}")
    public DataResponse<IssueBoardDto> detailIssue(@PathVariable Long issueId) {
        IssueBoardDto issueBoardDto = boardService.issueDetail(issueId);
        return new DataResponse<>(200, "이슈글 상세 조회 성공", issueBoardDto);
    }

    /**
     * 이슈 목록 조회 API
     * @param pageNo
     * @return 이슈 목록 리스트
     */
    @GetMapping("/issue")
    public DataResponse<List<IssueBoardDto>> listIssue(@RequestParam("pageNo") int pageNo) {
        List<IssueBoardDto> issueList = boardService.issueList(pageNo);
        return new DataResponse<>(200, "이슈글 목록 조회 성공", issueList);
    }

    /**
     * 이슈 논쟁 투표 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param issueId
     * @param map isAgree
     * @return Only code and message
     */
    @PostMapping("/issue/vote/{issueId}")
    public CommonResponse voteIssueBoard(@PathVariable Long issueId, @RequestBody Map<String, Boolean> map, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.voteIssueBoard(issueId, userId, map.get("isAgree"));
        return new CommonResponse(200, "이슈글 투표 성공");
    }


    /**
     * 댓글 작성 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentPostDto boardType, boardId, content
     * @return Only code and message
     */
    @PostMapping("/comment")
    public CommonResponse writeAdvice(@RequestBody CommentPostDto commentPostDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        commentPostDto.setUserId(userId);
        boardService.insertComment(commentPostDto);
        return new CommonResponse(200, "댓글 작성 성공");
    }

    /**
     * 댓글 수정 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentPostDto content
     * @return Only code and message
     */
    @PutMapping("/comment/{commentId}")
    public CommonResponse modifyAdvice(@PathVariable Long commentId, @RequestBody CommentPostDto commentPostDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        commentPostDto.setCommentId(commentId);
        commentPostDto.setUserId(userId);
        boardService.modifyComment(commentPostDto);
        return new CommonResponse(200, "댓글 수정 성공");
    }

    /**
     * 댓글 삭제 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentId
     * @return Only code and message
     */
    @DeleteMapping("/comment/{commentId}")
    public CommonResponse deleteComment(@PathVariable Long commentId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        CommentPostDto commentPostDto = new CommentPostDto();
        commentPostDto.setCommentId(commentId);
        commentPostDto.setUserId(userId);
        boardService.deleteComment(commentPostDto);
        return new CommonResponse(200, "댓글 삭제 성공");
    }
}
