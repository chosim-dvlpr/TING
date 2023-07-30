import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdvicePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 게시글 저장 로직: title과 content 값을 서버로 전송하여 저장하는 등의 작업을 수행
    axios.post('https://i9b107.p.ssafy.io:5157/advice', {
      title,
      body: content,
    })
    .then((response) => {
      if (response.status === 201) {
       
        navigate('/community/advice');
      } else {
        throw new Error('Failed to save the post');
      }
    })
    .catch((error) => {
      console.error('Error saving the post:', error);
    });
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

export default AdvicePostForm;
