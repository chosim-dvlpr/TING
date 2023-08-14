import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import IssueBoard from "../component/community/issue/IssueBoard";
import AdviceBoard from "../component/community/advice/AdviceBoard";
import NavBar from "../component/common/NavBar";

function CommunityPage() {
  return (
    <div>
      {/* <NavBar /> */}
      <div className="community-container">
        <div className="community-content">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/community/issue" replace />}
            />

            {/* adivce 게시판 */}
            <Route path="/advice" element={<AdviceBoard />} />

            {/* issue 게시판 */}
            <Route path="/issue" element={<IssueBoard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Community.js는 각 게시판 컨텐츠를 감싸는 역할을 하며 해당 페이지에 맞는 내용을 children으로 받아 렌더링함.
// community 컴포넌트 내부에 nested route 사용해야함

export default CommunityPage;
