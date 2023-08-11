import { useEffect, useState } from "react";
import styles from "./css/Report.module.css";
import Pagination from "react-bootstrap/Pagination";
import tokenHttp from "../../api/tokenHttp";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Report = () => {
  const [reportList, setReportList] = useState([]);
  const [searchParams, setSeratchParams] = useSearchParams();
  const [pageResult, setPageResult] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    let pageNo = searchParams.get("pageNo") ? searchParams.get("pageNo") : 1;
    tokenHttp
      .get(`/admin/report?page=${pageNo}`)
      .then((response) => {
        setReportList(response.data.data["reportList"]);
        setPageResult(response.data.data["pageResult"]);
      })
      .catch((error) => {});
    console.log(reportList);
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
    <div className={styles.reportContainer}>
      <div className={styles.title}>Report</div>
      <div className={styles.listContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tr className={styles.tableHeader}>
              <th>id</th>
              <th style={{ width: "150px" }}>신고자</th>
              <th style={{ width: "150px" }}>신고대상유저</th>
              <th style={{ width: "150px" }}>처리상태</th>
              <th style={{ width: "300px" }}>신고일</th>
              <th style={{ width: "200px" }}>신고상세</th>
            </tr>

            {/* 신고글을 불러와 반복문으로 표시 */}
            {reportList.map((report) => (
              <tr className={styles.tableBody}>
                <td>{report.reportId}</td>
                <td>{report.userNickname}</td>
                <td>{report.reportedUserNickname}</td>
                <td>{report.state}</td>
                <td>{convertTimeFormat(report.createdTime)}</td>
                <td>
                  <Button
                    onClick={() => navigate(`/admin/report/detail?reportedUserId=${report.reportedUserId}&reportId=${report.reportId}`)}
                    variant="secondary"
                  >
                    상세보기
                  </Button>
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
              <Pagination.Item onClick={handlePage(pageResult.page)} active>{pageResult.page}</Pagination.Item>
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

export default Report;
