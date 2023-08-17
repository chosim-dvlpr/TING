package com.ssafy.tingbackend.entity.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Getter
public enum ItemType {
    MATCHING_TICKET("구매한 티켓", "매칭에 필요한 티켓입니다."),
    REVIVE_TICKET("물고기 부활 티켓", "3일간 채팅을 하지 못해 죽은 물고기를 살릴 수 있습니다."),
    CHANGE_NICKNAME("닉네임 변경권", "닉네임을 1회 변경할 수 있습니다."),
    RANDOM_SKIN_BOX("물고기 스킨 랜덤박스", "물고기 스킨을 랜덤으로 뽑을 수 있습니다."),
    FREE_MATCHING_TICKET("무료 티켓", "매일 3개씩 주어지는 무료 매칭티켓입니다."),
    SKIN_2("유리병", "최대 2마리의 물고기와 대화할 수 있습니다."),
    SKIN_3("작은 어항", "최대 3마리의 물고기와 대화할 수 있습니다."),
    SKIN_5("수조", "최대 5마리의 물고기와 대화할 수 있습니다."),
    SKIN_10("아쿠아리움", "최대 10마리의 물고기와 대화할 수 있습니다.");

    private String name;
    private String description;
}
