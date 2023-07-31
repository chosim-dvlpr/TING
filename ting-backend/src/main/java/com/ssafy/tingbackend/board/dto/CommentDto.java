package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.type.BoardType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


public class CommentDto {
    @Getter
    @Setter
    public static class Request {
        private Long commentId;
        private Long boardId;
        private BoardType boardType;
        private String content;
        private Long userId;
        private Integer depth;
        private Long parentId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long commentId;
        private Long parentId;
        private String content;
        private String nickname;
        private Long likeCount;
        private LocalDateTime createdTime;
        private LocalDateTime modifiedTime;
        private boolean isRemoved;

        public static CommentDto.Response of(Comment comment, User user) {
            return Response.builder()
                    .commentId(comment.getId())
                    .parentId(comment.getParent()==null? null:comment.getParent().getId())
                    .content(comment.getContent())
                    .nickname(user.getNickname())
                    .likeCount(comment.getLikeCount())
                    .createdTime(comment.getCreatedTime())
                    .modifiedTime(comment.getModifiedTime())
                    .isRemoved(comment.isRemoved())
                    .build();
        }
    }


}
