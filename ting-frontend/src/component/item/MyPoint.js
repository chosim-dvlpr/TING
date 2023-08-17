import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { setPoint } from "../../redux/itemStore";
import { setPointPaymentId } from "../../redux/itemStore";
import styles from "./MyPoint.module.css";
import Pagination from "../community/common/Pagination";
import { getDate } from "../common/TimeCalculate";

function MyPoint() {
  const [chargeMenu, setChargeMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pointList, setPointList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // redux 관련 변수
  const dispatch = useDispatch();
  const myPoint = useSelector((state) => state.itemReducer.myPoint);

  // 자신의 포인트가 얼마인지 가져옴(마운트 될 때 한 번)
  useEffect(() => {
    tokenHttp
      .get("/point")
      .then((response) => {
        if (response.data.data !== myPoint) {
          dispatch(setPoint(response.data.data));
        }
      })
      .catch((err) => console.log(err));
    getPointList();
  }, [currentPage]);

  const getPointList = async () => {
    try {
      const response = await tokenHttp.get("/point/list", {
        params: { pageNo: currentPage },
      });
      const responseData = response.data.data;

      if (responseData.pointList) {
        setPointList(responseData.pointList);
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.error("Error fetching point history data:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const sign = (category) => {
    if (category == "포인트 충전") return "+";
    else return "-";
  };

  const isPlus = (category) => {
    if (category == "포인트 충전") return true;
    else return false;
  };

  const addComma = (number) => {
    let returnString = number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
  };

  return (
    <div>
      <div className={styles.MyPoint}>
        <span className={styles.PointText}>
          <img
            src={process.env.PUBLIC_URL + "/img/coin.png"}
            className={styles.coinImage}
            alt="coin"
          ></img>
          {addComma(myPoint)} 팅
        </span>
        <div
          className={styles.ChargeButton}
          onClick={() => {
            setChargeMenu(!chargeMenu);
          }}
        >
          포인트 충전
        </div>
      </div>
      {chargeMenu ? <SelectMoney /> : null}

      <div>
        <table className={styles.pointList}>
          <tbody>
            {pointList && pointList.length > 0 ? (
              pointList.map((history, index) => (
                <tr key={history.pointHistoryId}>
                  <td className={styles.time}>
                    <div className={styles.tdDiv}>
                      {getDate(history.changedTime)}
                    </div>
                  </td>
                  <td class={styles.category}>{history.category}</td>
                  <td
                    className={`${styles.cost} ${
                      isPlus(history.category) ? styles.plus : styles.minus
                    }`}
                  >
                    {sign(history.category)}
                    {addComma(history.changeCost)}
                  </td>
                  <td className={styles.point}>
                    {addComma(history.resultPoint)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>포인트 충전 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

// 컴포넌트는 대문자로 시작해야 인식함
//
function SelectMoney() {
  const dispatch = useDispatch();

  // api로 충전할 돈의 정보
  const [chargeMoneyData, setChargeMoneyData] = useState([]);

  // 충전하기 위해 보낼 정보
  const [selectChargeMoneyData, setSelectChargeMoneyData] = useState({});

  // 선택한 버튼 표시
  const [currentClick, setCurrentClick] = useState(null);
  const [prevClick, setPrevClick] = useState(null);

  useEffect(() => {
    tokenHttp
      .get("/point/charge/list")
      .then((response) => {
        setChargeMoneyData(response.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(
    (e) => {
      if (currentClick != null) {
        let current = document.getElementById(currentClick);
        current.style.backgroundColor = "#d75c6b";
        // current.style.borderBottom = "2px solid black";
      }
      if (prevClick != null) {
        let prev = document.getElementById(prevClick);
        prev.style.backgroundColor = "#fae6e8";
        // prev.style.borderBottom = "none";
      }
      setPrevClick(currentClick);
    },
    [currentClick]
  );

  const getClick = (e) => {
    setCurrentClick(e.target.id);
  };

  // 카카오 페이로 보내기 위한 함수
  const sendToKakaoPay = () => {
    let data = {
      pointCode: selectChargeMoneyData.pointCode,
      domain: window.location.origin,
    };
    tokenHttp
      .post("/point/kakaopay/ready", data)
      .then((response) => {
        dispatch(setPointPaymentId(response.data.data.pointPaymentId));
        window.location.href = response.data.data.redirectUrl;
      })
      .catch((err) => console.log(err));
  };

  const threeComma = (number) => {
    let returnString = number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
  }

  return (
    <div>
      <div>
        {chargeMoneyData.map((money, idx) => (
          <button
            key={idx}
            id={idx}
            className={styles.moneyButton}
            onClick={(e) => {
              setSelectChargeMoneyData(money);
              getClick(e);
            }}
          >
            {/* {money.totalAmount} */}
            {threeComma(money.totalAmount)}
          </button>
        ))}
      </div>
      <button
        className={styles.kakaoButton}
        onClick={() => {
          sendToKakaoPay();
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/img/kakaopay.png"}
          className={styles.kakaoImg}
          alt="kakaopay"
        ></img>
      </button>
    </div>
  );
}

export default MyPoint;
