package com.ssafy.tingbackend.common.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DataResponse<T> extends CommonResponse {

    private T data;

    public DataResponse(int code, String message) {
        super(code, message);
    }

    public DataResponse(int code, String message, T data) {
        super(code, message);
        this.data = data;
    }
}
