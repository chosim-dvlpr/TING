import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./InformationModal.module.css";

import tokenHttp from "../../../api/tokenHttp";

import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
// import { pink, blue } from "@mui/material/colors";
import { current } from "immer";

function ItemModal({ closeFunc, type, currentData, items, setter, color }) {
  const [checked, setChecked] = useState(
    (type === "취미" || type === "스타일" || type === "성격")
      ? items.map((item, i) =>
          currentData && currentData.some((d) => d.code === item.code)
            ? true
            : false
        )
      : null
  ); // 체크된 항목을 저장할 상태

  const handleChange = (event, i) => {
    const updatedChecked = [...checked]; // 기존 상태 배열 복사
    updatedChecked[i] = !updatedChecked[i]; // 인덱스의 값을 반전

    const updatedCurrentData = [];
    updatedChecked.map((element, i) => {
      if (element) updatedCurrentData.push(items[i]);
    });

    setter(updatedCurrentData);
    setChecked(updatedChecked); // 변경된 배열로 상태 업데이트
  };

  return (
    <div>
      <div className={styles.ModalOuter} onClick={closeFunc}></div>
      <div className={styles.ModalInner}>
        {/* <FormControl> */}
        <FormLabel id="demo-radio-buttons-group-label">{type}</FormLabel>
        {type === "취미" || type === "성격" || type === "스타일" ? (
          // 다중 선택 가능한 항목(취미, 성격, 스타일)의 경우 - 체크박스
          <FormGroup>
            {items.map((item, i) => (
              <FormControlLabel
                key={i}
                value={item.name}
                control={
                  <Checkbox
                    checked={checked[i]}
                    sx={{
                      color: color,
                      "&.Mui-checked": {
                        color: color,
                      },
                    }}
                    onChange={(event) => {
                      handleChange(event, i);
                    }}
                  />
                }
                label={item.name}
              />
            ))}
          </FormGroup>
        ) : (
          // 단일 선택만 가능한 경우 - 라디오버튼
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={currentData ? currentData.name : ""}
            name="radio-buttons-group"
            onChange={(event) => {
              setter(
                items.find((element) => element.name === event.target.value)
              );
            }}
          >
            {items && items.map((item, i) => (
              <FormControlLabel
                value={item.name}
                control={
                  <Radio
                    sx={{
                      color: color,
                      "&.Mui-checked": {
                        color: color,
                      },
                    }}
                  />
                }
                label={item.name}
              />
            ))}
          </RadioGroup>
        )}
        {/* </FormControl> */}
      </div>
    </div>
  );
}

export default ItemModal;
