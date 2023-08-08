import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenHttp from '../../api/tokenHttp';

function QnaCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 
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

    const newQna = {
      title: title,
      content: content,
    };

    try {
      const response = await tokenHttp.post('/mypage/qna', newQna);
      if (response.status === 200) {
        navigate('/mypage/qna');
      } else if (response.status === 400) {
        console.log('실패')
      } else if (response.status === 403) {
        console.log('권한 없음')
      } else {
      throw new Error('Failed to save the post');
      }
    } catch (error) {
      console.error('Error saving the post:', error);
    }
  };

  return (
    <div>
      <h1>문의 작성하기</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">
            저장
          </button>
        </div>
      </form>
    </div>
  )
}

export default QnaCreate;