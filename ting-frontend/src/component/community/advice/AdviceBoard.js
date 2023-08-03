import axios from "axios";
import React, { useState, useEffect } from "react";
import AdviceCreate from "./AdviceCreate";

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
        <div>
            <h1>Advice Board</h1>
            <table>
                <thead>
                    <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {adviceList.map((advice, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>adviceId</td>
                                <td>{advice.adviceId}</td>
                            </tr>
                            <tr>
                                <td>title</td>
                                <td>{advice.title}</td>
                            </tr>
                            <tr>
                                <td>content</td>
                                <td>{advice.content}</td>
                            </tr>
                            {/* Repeat for other properties */}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <AdviceCreate/>
        </div>
    );
}

export default AdviceBoard;
