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
public class AdviceBoardDto {
    private Long id;
//    private Long userId;
    private String title;
    private String content;
    private Long hit;
    private List<Comment> comments;
    private String nickname;
    private LocalDateTime createdTime;
    private LocalDateTime modifiedTime;

    public static AdviceBoardDto of(AdviceBoard adviceBoard, User user) {
        return AdviceBoardDto.builder()
                .id(adviceBoard.getId())
                .title(adviceBoard.getTitle())
                .content(adviceBoard.getContent())
                .hit(adviceBoard.getHit())
                .nickname(user.getNickname())
                .createdTime(adviceBoard.getCreatedTime())
                .modifiedTime(adviceBoard.getModifiedTime())
                .build();
    }
}
