package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "comment"})
@Builder
@AllArgsConstructor
public class CommentLike extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;
}
