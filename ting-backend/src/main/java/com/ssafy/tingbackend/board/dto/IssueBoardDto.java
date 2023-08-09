package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class IssueBoardDto {

    @Getter
    @Setter
    public static class Request {
        private Long issueId;
        private String title;
        private String content;
        private String agreeTitle;
        private String opposeTitle;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long issueId;
        private String title;
        private String content;
        private Long hit;
        private List<Comment> comments;
        private String nickname;
        private LocalDateTime createdTime;
        private String agreeTitle;
        private String opposeTitle;
        private Long agreeCount;
        private Long opposeCount;

        public static IssueBoardDto.Response of (IssueBoard issueBoard, User user){
            return IssueBoardDto.Response.builder()
                    .issueId(issueBoard.getId())
                    .title(issueBoard.getTitle())
                    .content(issueBoard.getContent())
                    .hit(issueBoard.getHit())
                    .nickname(user.getNickname())
                    .createdTime(issueBoard.getCreatedTime())
                    .agreeTitle(issueBoard.getAgreeTitle())
                    .opposeTitle(issueBoard.getOpposeTitle())
                    .agreeCount(issueBoard.getAgreeCount())
                    .opposeCount(issueBoard.getOpposeCount())
                    .build();
        }
    }
}
