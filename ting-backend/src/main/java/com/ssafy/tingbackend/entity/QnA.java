package com.ssafy.tingbackend.entity;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "title", "isCompleted"})
@DynamicInsert
@Builder
@AllArgsConstructor
public class QnA extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String content;
    private String answer;

    private LocalDateTime completedTime;
    @ColumnDefault("false")
    private boolean isCompleted;

}
