package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "content", "depth"})
@DynamicInsert
public class Comment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent")
    private List<Comment> children;

    private String boardType; //enum?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advice_board_id")
    private AdviceBoard adviceBoard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_board_id")
    private IssueBoard issueBoard;

    private String content;
    private Integer depth;
    private boolean isAnonymous;
    @ColumnDefault("0")
    private Long likeCount;

    @OneToMany(mappedBy = "comment")
    List<CommentLike> commentLikes = new ArrayList<>();
}
