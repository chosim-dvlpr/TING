import React from 'react';
// jsx를 자바스크립트로 변환해주는 react 라이브러리를 현재 파일에서 사용하겠다는 의미임

import './Sidebar.module.css'

import {Link} from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
          <aside>
          <ul>
            <li>
              <Link to="/community/issue">논쟁 게시판</Link>
            </li>
            <li>
              <Link to="/community/advice">상담 게시판</Link>
            </li>
          </ul>
          </aside>
        </div>
      );
};

export default Sidebar;