package com.ssafy.tingbackend.entity.chatting;

import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"id"})
public class ChattingUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id")
    private Chatting chatting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer unread;

    public ChattingUser(Chatting chatting, User user) {
        this.chatting = chatting;
        this.user = user;
        this.unread = 0;
    }
}
