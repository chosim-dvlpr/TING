import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenHttp from '../../../api/tokenHttp';

const AdviceCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    tokenHttp
      .get('/user') // 사용자 정보를 가져오는 엔드포인트를 설정해주세요
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 사용자가 로그인되어 있지 않으면 리다이렉트
    if (!user) {
      navigate('/login'); // 로그인 페이지로 리다이렉트
      return;
    }

    const newPost = {
      title: title,
      content: content,
    };

    try {
      const response = await tokenHttp.post('/advice', newPost);
      if (response.status === 201) {
        navigate('/community/advice'); // 게시글 작성 후 페이지 이동
      } else {
        throw new Error('Failed to save the post');
      }
    } catch (error) {
      console.error('Error saving the post:', error);
    }
  };

  return (
    <div>
      <h2>게시글 작성 폼</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
};

export default AdviceCreate;
