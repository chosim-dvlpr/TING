import { useEffect, useState } from "react";
import styles from "./css/Report.module.css";
import Pagination from "react-bootstrap/Pagination";
import tokenHttp from "../../api/tokenHttp";
import { useSearchParams } from "react-router-dom";

const Report = () => {
  const [reportList, setReportList] = useState([]);
  const [searchParams, setSeratchParams] = useSearchParams();

  useEffect(() => {
    let pageNo = searchParams.get("pageNo") ? searchParams.get("pageNo") : 1;
    tokenHttp
      .get(`/admin/report?page=${pageNo}`)
      .then((response) => {
        console.log(response);
        setReportList(response.data.data["reportList"]);
      })
      .catch((error) => {});
  }, []);

  return (
    <div className={styles.reportContainer}>
      <div className={styles.title}>Report</div>
      <div className={styles.listContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tr className={styles.tableHeader}>
              <th>id</th>
              <th>신고자</th>
              <th>신고대상유저</th>
              <th>처리상태</th>
              <th>신고상세</th>
            </tr>

            {/* 신고글을 불러와 반복문으로 표시 */}
            {reportList.map((report) => (
              <tr className={styles.tableBody}>
                <td>{report.id}</td>
                <td>{report.userId}</td>
                <td>{report.reportedUser}</td>
                <td>{report.status}</td>
                <td>{report.content}</td>
              </tr>
            ))}

            <tr className={styles.tableBody}>
              <td>1</td>
              <td>신고자1</td>
              <td>신고대상유저1</td>
              <td>처리완료</td>
              <td>신고내용</td>
            </tr>
          </table>
          <div className={styles.pagination}>
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
