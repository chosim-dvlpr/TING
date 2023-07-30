import React, { useState } from 'react';
import axios from 'axios'; // axios를 import

const AdvicePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 게시글 저장 로직: title과 content 값을 서버로 전송하여 저장하는 등의 작업을 수행합니다.
      const response = await axios.post('', {
        title,
        body: content,
      });

      if (!response.status === 201) {
        throw new Error('Failed to save the post');
      }

      // 작성 완료 후 게시글 목록 페이지로 이동
      // 예: history.push('/community/advice');
    } catch (error) {
      console.error('Error saving the post:', error);
    }
  };

  // handleCancel 함수는 더 이상 필요하지 않으므로 삭제

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
