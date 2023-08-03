package com.ssafy.tingbackend.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StompDestination {
    private String lastDestination;
    private boolean isRoomLast;
}
