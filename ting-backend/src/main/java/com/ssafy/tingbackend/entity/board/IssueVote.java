package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "issueBoard", "isAgree"})
public class IssueVote extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_board_id")
    private IssueBoard issueBoard;

    private boolean isAgree;

    public IssueVote(User user, IssueBoard issueBoard, Boolean isAgree) {
        this.user = user;
        this.issueBoard = issueBoard;
        this.isAgree = isAgree;
    }

}
