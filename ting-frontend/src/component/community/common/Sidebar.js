import React from 'react';


import styles from './Sidebar.module.css'

import {Link, NavLink} from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
          <aside>
          <ul>
            <li>
              <NavLink to="/community/issue" className={({isActive}) => {
                return isActive? styles.selected : '';
              }}>논쟁 게시판</NavLink>
              {/* <Link to="/community/issue">논쟁 게시판</Link> */}
            </li>
            <li>
            <NavLink to="/community/advice" className={({isActive}) => {
                return isActive? styles.selected : '';
              }}>상담 게시판</NavLink>
              {/* <Link to="/community/advice">상담 게시판</Link> */}
            </li>
          </ul>
          </aside>
        </div>
      );
};

export default Sidebar;