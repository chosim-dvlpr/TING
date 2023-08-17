import Pagination from "react-bootstrap/Pagination";
import styles from "./css/Qna.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import tokenHttp from "../../api/tokenHttp";
import Button from "react-bootstrap/Button";

const Qna = () => {
  const [qnaList, setQnaList] = useState([]);
  const [searchParams, setSeratchParams] = useSearchParams();
  const [pageResult, setPageResult] = useState({});

  useEffect(() => {
    const pageNo = searchParams.get("pageNo") || 1;
    tokenHttp
      .get(`/admin/qna?page=${pageNo}`)
      .then((response) => {
        setQnaList(response.data.data["qnaList"]);
        setPageResult(response.data.data["pageResult"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams]);

  const handlePage = (page) => () => {
    setSeratchParams({ ...searchParams, pageNo: page });
  };

  const convertTimeFormat = (time) => {
    if (!time) return;
    const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
    const date = new Date(time);
    return new Date(date.getTime() + 2 * TIME_ZONE).toISOString().replace("T", " ").slice(0, -5);
  };

  return (
    <div className={styles.QnaContainer}>
      <div className={styles.title}>Report</div>
      <div className={styles.listContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tr className={styles.tableHeader}>
              <th style={{ width: "120px" }}>id</th>
              <th style={{ width: "150px" }}>유저</th>
              <th style={{ width: "150px" }}>제목</th>
              <th style={{ width: "250px" }}>문의시간</th>
              <th style={{ width: "150px" }}>처리상태</th>
              <th style={{ width: "200px" }}>문의상세</th>
            </tr>

            {/* 문의글을 불러와 테이블에 출력 */}
            {qnaList.map((qna) => (
              <tr className={styles.tableBody}>
                <td>{qna.qnaId}</td>
                <td>{qna.userNickname}</td>
                <td>{qna.title}</td>
                <td>{convertTimeFormat(qna.createdTime)}</td>
                <td>{qna.completed ? "답변완료" : "미처리"}</td>
                <td>
                  <Button>상세보기</Button>
                </td>
              </tr>
            ))}
          </table>
          <div className={styles.pagination}>
            <Pagination>
              {pageResult.first ? <Pagination.Prev disabled /> : <Pagination.Prev onClick={handlePage(pageResult.page - 1)} />}
              {pageResult.first ? (
                <Pagination.Item disabled>-</Pagination.Item>
              ) : (
                <Pagination.Item onClick={handlePage(pageResult.page - 1)}>{pageResult.page - 1}</Pagination.Item>
              )}
              <Pagination.Item onClick={handlePage(pageResult.page)} active>
                {pageResult.page}
              </Pagination.Item>
              {pageResult.last ? (
                <Pagination.Item disabled>-</Pagination.Item>
              ) : (
                <Pagination.Item onClick={handlePage(pageResult.page + 1)}>{pageResult.page + 1}</Pagination.Item>
              )}
              {pageResult.last ? <Pagination.Next disabled /> : <Pagination.Next onClick={handlePage(pageResult.page + 1)} />}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qna;
