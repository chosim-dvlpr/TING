package com.ssafy.tingbackend.board.controller;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.board.dto.CommentDto;
import com.ssafy.tingbackend.board.dto.IssueBoardDto;
import com.ssafy.tingbackend.board.service.BoardService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.entity.type.BoardType;
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
     * @param adviceBoardRequest title, content
     * @return Only code and message
     */
    @PostMapping("/advice")
    public CommonResponse writeAdvice(@RequestBody AdviceBoardDto.Request adviceBoardRequest, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.insertAdviceBoard(adviceBoardRequest, userId);
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
     * @param adviceBoardRequest title, content
     * @return Only code and message
     */
    @PutMapping("/advice/{adviceId}")
    public CommonResponse modifyAdvice(@PathVariable Long adviceId, @RequestBody AdviceBoardDto.Request adviceBoardRequest, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        adviceBoardRequest.setAdviceId(adviceId);
        boardService.modifyAdviceBoard(adviceBoardRequest, userId);
        return new CommonResponse(200, "상담글 수정 성공");
    }

    /**
     * 상담 상세 조회 API
     * @param adviceId
     * @return 상담 상세 정보
     */
    @GetMapping("/advice/{adviceId}")
    public DataResponse<AdviceBoardDto.DetailResponse> detailAdvice(@PathVariable Long adviceId) {
        AdviceBoardDto.DetailResponse adviceBoardResponse = boardService.adviceDetail(adviceId);
        return new DataResponse<>(200, "상담글 상세 조회 성공", adviceBoardResponse);
    }

    /**
     * 상담 목록 조회 API
     * @param pageNo
     * @return 문의 목록 리스트 adviceBoardList, totalPages, totalElements
     */
    @GetMapping("/advice")
    public DataResponse<Map<String, Object>> listAdvice(@RequestParam("pageNo") int pageNo) {
        Map<String, Object> result = boardService.adviceList(pageNo);
        return new DataResponse<>(200, "상담글 목록 조회 성공", result);
    }

    /**
     * 상담 검색 조회 API
     * @param pageNo
     * @return 문의 목록 리스트 adviceBoardList, totalPages, totalElements
     */
    @GetMapping("/advice/search")
    public DataResponse<Map<String, Object>> searchAdvice(@RequestParam("pageNo") int pageNo, @RequestParam("keyword") String keyword) {
        Map<String, Object> result = boardService.adviceSearchList(pageNo,keyword);
        return new DataResponse<>(200, "상담글 검색 조회 성공", result);
    }

    /**
     * 내 상담 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param pageNo
     * @return 문의 목록 리스트 adviceBoardList, totalPages, totalElements
     */
    @GetMapping("/advice/my")
    public DataResponse<Map<String, Object>> listMyAdvice(@RequestParam("pageNo") int pageNo, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        Map<String, Object> result = boardService.adviceMyList(userId, pageNo);
        return new DataResponse<>(200, "내 상담글 검색 조회 성공", result);
    }


    /**
     * 이슈 게시글 작성 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param issueBoardRequest title, content, agreeTitle, opposeTitle
     * @return Only code and message
     */
    @PostMapping("/issue")
    public CommonResponse writeIssue(@RequestBody IssueBoardDto.Request issueBoardRequest, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.insertIssueBoard(issueBoardRequest, userId);
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
    public DataResponse<IssueBoardDto.Response> detailIssue(@PathVariable Long issueId) {
        IssueBoardDto.Response issueBoardResponse = boardService.issueDetail(issueId);
        return new DataResponse<>(200, "이슈글 상세 조회 성공", issueBoardResponse);
    }

    /**
     * 이슈 목록 조회 API
     * @param pageNo
     * @return 이슈 목록 리스트 issueBoardList, totalPages, totalElements
     */
    @GetMapping("/issue")
    public DataResponse<Map<String, Object>> searchIssue(@RequestParam("pageNo") int pageNo) {
        Map<String, Object> result = boardService.issueList(pageNo);
        return new DataResponse<>(200, "이슈글 목록 조회 성공", result);
    }

    /**
     * 이슈 검색 목록 조회 API
     * @param pageNo
     * @return 이슈 목록 리스트 issueBoardList, totalPages, totalElements
     */
    @GetMapping("/issue/search")
    public DataResponse<Map<String, Object>> listIssue(@RequestParam("pageNo") int pageNo, @RequestParam("item") String item, @RequestParam("keyword") String keyword) {
        Map<String, Object> result = boardService.issueSearchList(pageNo, item, keyword);
        return new DataResponse<>(200, "이슈글 검색 목록 조회 성공", result);
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
     * @param commentRequest boardType, boardId, content
     * @return Only code and message
     */
    @PostMapping("/comment")
    public CommonResponse writeComment(@RequestBody CommentDto.Request commentRequest, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        commentRequest.setUserId(userId);
        boardService.insertComment(commentRequest);
        return new CommonResponse(200, "댓글 작성 성공");
    }

    /**
     * 댓글 수정 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentRequest content
     * @return Only code and message
     */
    @PutMapping("/comment/{commentId}")
    public CommonResponse modifyComment(@PathVariable Long commentId, @RequestBody CommentDto.Request commentRequest, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        commentRequest.setCommentId(commentId);
        commentRequest.setUserId(userId);
        boardService.modifyComment(commentRequest);
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
        CommentDto.Request commentPostDto = new CommentDto.Request();
        commentPostDto.setCommentId(commentId);
        commentPostDto.setUserId(userId);
        boardService.deleteComment(commentPostDto);
        return new CommonResponse(200, "댓글 삭제 성공");
    }

    /**
     * 댓글 목록 조회 API
     * @param boardType, boardId
     * @return 댓글 목록 리스트
     */
    @GetMapping("/comment/{boardType}/{boardId}")
    public DataResponse<List<CommentDto.Response>> listComment(@PathVariable BoardType boardType, @PathVariable Long boardId) {
        List<CommentDto.Response> commentList = boardService.commentList(boardType, boardId);
        return new DataResponse<>(200, "댓글 목록 조회 성공", commentList);
    }

    /**
     * 대댓글 목록 조회 API
     * @param boardType, boardId, commentId
     * @return 댓글 목록 리스트
     */
    @GetMapping("/comment/{boardType}/{boardId}/{commentId}")
    public DataResponse<List<CommentDto.Response>> listComment(@PathVariable BoardType boardType, @PathVariable Long boardId, @PathVariable Long commentId) {
        List<CommentDto.Response> commentList = boardService.commentChildList(boardType, boardId, commentId);
        return new DataResponse<>(200, "대댓글 목록 조회 성공", commentList);
    }

    /**
     * 내 댓글 좋아요 목록 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param boardType, boardId
     * @return 댓글 목록 리스트
     */
    @GetMapping("/comment/like/{boardType}/{boardId}")
    public DataResponse<List<Long>> listComment(@PathVariable BoardType boardType, @PathVariable Long boardId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        List<Long> myLikeList = boardService.myLikeList(boardType, boardId, userId);
        return new DataResponse<>(200, "내 댓글 좋아요 목록 조회 성공", myLikeList);
    }

    /**
     * 댓글 좋아요 등록 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentId
     * @return Only code and message
     */
    @PostMapping("/comment/like/{commentId}")
    public CommonResponse likeComment(@PathVariable Long commentId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.likeComment(commentId, userId);
        return new CommonResponse(200, "좋아요 등록 성공");
    }

    /**
     * 댓글 좋아요 삭제 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param commentId
     * @return Only code and message
     */
    @DeleteMapping("/comment/like/{commentId}")
    public CommonResponse deletelikeComment(@PathVariable Long commentId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        boardService.deleteLikeComment(commentId, userId);
        return new CommonResponse(200, "좋아요 삭제 성공");
    }
}
