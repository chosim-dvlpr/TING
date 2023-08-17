import { useState, useEffect } from "react";
import styles from "./InformationModal.module.css";

import {
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";

function ItemModal({ closeFunc, type, currentData, items, setter, color }) {
  const [nowType, setNowType] = useState();
  const [nowItems, setNowItems] = useState();
  const [selectedData, setSelectedData] = useState();
  const [checked, setChecked] = useState([]); // 체크된 항목을 저장할 상태

  useEffect(() => {
    setNowType(type);
    setNowItems(items);
    if (type === "취미" || type === "스타일" || type === "성격") {
      let newChecked = items.map(
        (item) => currentData && currentData.some((d) => d.code === item.code)
      );
      setChecked(newChecked);
      setSelectedData(null);
    } else {
      setSelectedData(currentData ? currentData.name : null);
      setChecked(null);
    }
  }, [type]);

  const handleChange = (event, i) => {
    const updatedChecked = [...checked]; // 기존 상태 배열 복사
    updatedChecked[i] = !updatedChecked[i]; // 인덱스의 값을 반전

    const updatedCurrentData = [];
    updatedChecked.map((element, i) => {
      if (element) updatedCurrentData.push(nowItems[i]);
    });

    setter(updatedCurrentData);
    setChecked(updatedChecked); // 변경된 배열로 상태 업데이트
  };

  return (
    <div>
      <div className={styles.ModalOuter} onClick={closeFunc}></div>
      <div className={styles.ModalInner}>
        <FormLabel id="demo-radio-buttons-group-label">{nowType}</FormLabel>
        {nowType === "취미" || nowType === "성격" || nowType === "스타일" ? (
          // 다중 선택 가능한 항목(취미, 성격, 스타일)의 경우 - 체크박스
          <FormGroup>
            {nowItems &&
              nowItems.map((item, i) => (
                <FormControlLabel
                  key={i}
                  value={item.name}
                  control={
                    <Checkbox
                      key={i}
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
            aria-labelledby="demo-controlled-radio-buttons-group"
            value={selectedData ? selectedData : ""}
            name="controlled-radio-buttons-group"
            onChange={(event) => {
              setSelectedData(event.target.value);
              setter(
                nowItems.find((element) => element.name === event.target.value)
              );
            }}
          >
            {nowItems &&
              nowItems.map((item, i) => (
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
      </div>
    </div>
  );
}

export default ItemModal;
