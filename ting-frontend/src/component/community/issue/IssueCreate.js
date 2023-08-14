import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenHttp from '../../../api/tokenHttp';
import styles from './IssueCreate.module.css'; 
import NavBar from '../../common/NavBar';
import Sidebar from '../common/Sidebar';
// import NavBar from '../../common/NavBar';



const IssueCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [agreeTitle, setAgreeTitle] = useState(''); 
    const [opposeTitle, setOpposeTitle] = useState(''); 
    const [user, setUser] = useState(null);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchUserInfo();
    }, []);
  
    const fetchUserInfo = () => {
      tokenHttp
        .get('/user')
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!user) {
        navigate('/login');
        return;
      }
  
      const newPost = {
        title: title,
        content: content,
        agreeTitle: agreeTitle,
        opposeTitle: opposeTitle,
      };
  
      try {
        const response = await tokenHttp.post('/issue', newPost);
        if (response.status === 200) {
          navigate('/community/issue');
        } else {
          throw new Error('Failed to save the post');
        }
      } catch (error) {
        console.error('Error saving the post:', error);
      }
    };
  
    return (
      <div>
      <div className={styles.issueBoardBackGround}>
        <NavBar/>
      <div className={styles.issueBoardContainer}>
        <Sidebar/>

      <div className={styles.formContainer}>
       
        <h2>A VS B</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              주제
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="agreeTitle" className={styles.label}>
              A 투표 항목
            </label>
            <input
              id="agreeTitle"
              value={agreeTitle}
              onChange={(e) => setAgreeTitle(e.target.value)} 
              required
              className={styles.inputField}
            />
            <label htmlFor="opposeTitle" className={styles.label}>
              B 투표 항목 
            </label>
            <input
              id="opposeTitle"
              value={opposeTitle}
              onChange={(e) => setOpposeTitle(e.target.value)} 
              className={styles.inputField} 
            />
            <label htmlFor="content" className={styles.label}>
              상세 내용
            </label>
            <input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>
              저장
            </button>
          </div>
        </form>
      </div>
      </div>
      </div> 
      </div>
    );
  };
  
  export default IssueCreate;
  