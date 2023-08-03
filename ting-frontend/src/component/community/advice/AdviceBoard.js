import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdviceCreate from "./AdviceCreate";
import styles from "./AdviceBoard.module.css";

function AdviceBoard() {
    const [adviceList, setAdviceList] = useState([]);

    useEffect(() => {
        getAllAdviceData();
    }, []);

    const getAllAdviceData = async () => {
        let page = 1;
        let allData = [];

        try {
            while (true) {
                const response = await axios.get("https://i9b107.p.ssafy.io:5157/advice", { params: { "pageNo": page } });
                const data = response.data.data;
                if (data.length === 0) {
                    break; // No more data to fetch
                }
                allData = [...allData, ...data];
                page++;
            }

            setAdviceList(allData);
        } catch (error) {
            console.error("Error fetching advice data:", error);
        }
    };

    return (
        <div className={styles.adviceBoardContainer}>
            <h1>Advice Board</h1>
            <table className={styles.adviceTable}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>title</th>
                        <th>nickname</th>
                        <th>hit</th>
                        <th>createdTime</th>
                        <th>modifiedTime</th>
                    </tr>
                </thead>
                <tbody>
                    {adviceList.map((advice, index) => (
                        <tr key={advice.adviceId}>
                            <td>{advice.adviceId}</td>
                            <td>
                                <Link to={`/community/advice/detail/${advice.adviceId}`}>{advice.title}</Link>
                            </td>
                            <td>{advice.nickname}</td>
                            <td>{advice.hit}</td>
                            <td>{advice.createdTime}</td>
                            <td>{advice.modifiedTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AdviceCreate />
        </div>
    );
}

export default AdviceBoard;
