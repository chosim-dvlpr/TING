package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseUnmodifidableTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "title", "content"})
@DynamicInsert
@Builder
@AllArgsConstructor
public class IssueBoard extends BaseUnmodifidableTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String content;
    private String agreeTitle;
    private String opposeTitle;
    @ColumnDefault("0")
    private Long agreeCount;
    @ColumnDefault("0")
    private Long opposeCount;
    @ColumnDefault("0")
    private Long hit;

    @OneToMany(mappedBy = "issueBoard")
    private List<Comment> comments;
}
