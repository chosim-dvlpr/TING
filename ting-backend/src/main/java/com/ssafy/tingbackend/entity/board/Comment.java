package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
import com.ssafy.tingbackend.entity.type.BoardType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "content", "depth"})
@DynamicInsert
@Builder
@AllArgsConstructor
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

    @Enumerated(EnumType.STRING)
    private BoardType boardType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advice_board_id")
    private AdviceBoard adviceBoard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_board_id")
    private IssueBoard issueBoard;

    private String content;
    private Integer depth;
    @ColumnDefault("0")
    private Long likeCount;

    @OneToMany(mappedBy = "comment")
    private List<CommentLike> commentLikes = new ArrayList<>();

    public void setAdviceBoard(AdviceBoard adviceBoard) {
        if(this.adviceBoard != null) {
            this.adviceBoard.getComments().remove(this);
        }
        this.adviceBoard = adviceBoard;
        adviceBoard.getComments().add(this);
    }

    public void setIssueBoard(IssueBoard issueBoard) {
        if(this.issueBoard != null) {
            this.issueBoard.getComments().remove(this);
        }
        this.issueBoard = issueBoard;
        issueBoard.getComments().add(this);
    }
}
