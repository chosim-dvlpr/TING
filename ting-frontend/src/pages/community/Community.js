/* AdviceBoard, IssueBoard로 이동할 수 있는 사이드바 구현
router로 라우팅 구성하기 
/community로 이동했을 경우 어떤 페이지를 기본적으로 보여줄지 질문*/


import React from 'react';
import Sidebar from '../../component/community/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AdviceBoard from './AdviceBoard';
import IssueBoard from './IssueBoard';

const Community = () => {
  return (
    <div className="community-container">
      <Sidebar/>
      <div className="community-content">
        <Routes>
          {/* 커뮤니티 메인 페이지 */}
          <Route path="/" element={<IssueBoard />} />

          {/* adivce 게시판 */}
          <Route path="advice" element={<AdviceBoard />} />

          {/* issue 게시판 */}
          <Route path="issue" element={<IssueBoard />} />
        </Routes>
      </div>
    </div>
  );
};

// Community.js는 각 게시판 컨텐츠를 감싸는 역할을 하며 해당 페이지에 맞는 내용을 children으로 받아 렌더링함.
// community 컴포넌트 내부에 nested route 사용해야함

export default Community;
