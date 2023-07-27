package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long commentId;
    private String content;
    private String nickname;
    private Long likeCount;
    private LocalDateTime createdTime;
    private LocalDateTime modifiedTime;
    private boolean isRemoved;

//    public static CommentDto of(Comment comment, User user) {
//        return CommentDto.builder()
//                .build();
//    }
}
