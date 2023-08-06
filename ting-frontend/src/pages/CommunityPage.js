import React from 'react';

import { Routes, Route } from 'react-router-dom';


import Sidebar from '../component/community/common/Sidebar';
import IssueBoard from '../component/community/issue/IssueBoard';
import AdviceBoard from '../component/community/advice/AdviceBoard';

function CommunityPage() {

  return (
    <div className="community-container">
      <Sidebar/>
      <div className="community-content">
        <Routes>
         
          <Route path="/" element={<IssueBoard />} />

          {/* adivce 게시판 */}
          <Route path="/advice" element={<AdviceBoard />} />

          {/* issue 게시판 */}
          <Route path="/issue" element={<IssueBoard />} />
        </Routes>
      </div>
    </div>
  );
};

// Community.js는 각 게시판 컨텐츠를 감싸는 역할을 하며 해당 페이지에 맞는 내용을 children으로 받아 렌더링함.
// community 컴포넌트 내부에 nested route 사용해야함

export default CommunityPage;
