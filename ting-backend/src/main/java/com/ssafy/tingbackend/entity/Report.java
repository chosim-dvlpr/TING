package com.ssafy.tingbackend.entity;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import com.ssafy.tingbackend.entity.type.ReportStateType;
import com.ssafy.tingbackend.entity.type.ReportType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@ToString(of = {})
public class Report extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String content;

    @Enumerated(EnumType.STRING)
    private ReportStateType state;

    @Enumerated(EnumType.STRING)
    private ReportType type; // 게시글, 댓글, 소개팅

    private Long typeId;    // 신고 타겟에 대한 PK 값 (게시글이면 게시글 PK, 댓글이면 댓글 PK, 소개팅이면 소개팅 PK)

    private String comment; // 관리자가 처리한 내용

    public void setComment(String comment) {
        this.comment = comment;
    }
}
