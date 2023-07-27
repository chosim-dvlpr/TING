package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.type.BoardType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentPostDto {
    private Long commentId;
    private Long boardId;
    private BoardType boardType;
    private String content;
    private Long userId;
}
