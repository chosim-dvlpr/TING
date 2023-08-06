import React from 'react';


import styles from './Sidebar.module.css'

import {Link} from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
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