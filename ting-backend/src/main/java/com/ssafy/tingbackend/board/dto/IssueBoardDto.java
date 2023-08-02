package com.ssafy.tingbackend.board.dto;

import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueBoardDto {
    private Long id;
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

    public static IssueBoardDto of(IssueBoard issueBoard, User user) {
        return IssueBoardDto.builder()
                .id(issueBoard.getId())
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
