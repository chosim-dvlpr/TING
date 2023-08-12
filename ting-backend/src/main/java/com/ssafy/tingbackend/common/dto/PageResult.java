package com.ssafy.tingbackend.common.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PageResult {

    private int page;
    private int size;
    private int totalElements;
    private int totalPage;
    private boolean isFirst;
    private boolean isLast;

    public PageResult(int page, int size, int totalElements, int totalPage, boolean isFirst, boolean isLast) {
        this.page = page + 1;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPage = totalPage;
        this.isFirst = isFirst;
        this.isLast = isLast;
    }
}
