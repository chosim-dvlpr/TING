package com.ssafy.tingbackend.entity.user;

import com.ssafy.tingbackend.user.service.UserService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserStyle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_code")
    private AdditionalInfo additionalInfo;

    public UserStyle(User user, AdditionalInfo additionalInfo) {
        this.user = user;
        this.additionalInfo = additionalInfo;
    }
}
