package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class AdviceBoardDto {

    @Getter
    @Setter
    public static class Request {
        private Long adviceId;
        private String title;
        private String content;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long adviceId;
        private String title;
        private String content;
        private Long hit;
        private List<Comment> comments;
        private String nickname;
        private LocalDateTime createdTime;
        private LocalDateTime modifiedTime;
        public static AdviceBoardDto.Response of(AdviceBoard adviceBoard, User user) {
            System.out.println("dto" + adviceBoard.getModifiedTime());
            return AdviceBoardDto.Response.builder()
                    .adviceId(adviceBoard.getId())
                    .title(adviceBoard.getTitle())
                    .content(adviceBoard.getContent())
                    .hit(adviceBoard.getHit())
                    .nickname(user.getNickname())
                    .createdTime(adviceBoard.getCreatedTime())
                    .modifiedTime(adviceBoard.getModifiedTime())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailResponse {
        private Long adviceId;
        private String title;
        private String content;
        private Long hit;
        private List<Comment> comments;
        private String nickname;
        private LocalDateTime createdTime;
        private LocalDateTime modifiedTime;
        public static AdviceBoardDto.DetailResponse of(AdviceBoard adviceBoard, User user) {
            System.out.println("dto" + adviceBoard.getModifiedTime());
            return AdviceBoardDto.DetailResponse.builder()
                    .adviceId(adviceBoard.getId())
                    .title(adviceBoard.getTitle())
                    .content(adviceBoard.getContent())
                    .hit(adviceBoard.getHit()+1)
                    .nickname(user.getNickname())
                    .createdTime(adviceBoard.getCreatedTime())
                    .modifiedTime(adviceBoard.getModifiedTime())
                    .build();
        }
    }

}
