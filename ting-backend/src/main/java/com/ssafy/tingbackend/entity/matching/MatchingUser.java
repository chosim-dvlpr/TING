package com.ssafy.tingbackend.entity.matching;

import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "totalScore"})
public class MatchingUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id")
    private Matching matching;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer totalScore;

    private Boolean finalChoice;

    public MatchingUser(Matching matching, User user) {
        this.matching = matching;
        this.user = user;
    }
}
