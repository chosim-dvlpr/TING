import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios를 import

import AdvicePostForm from './AdviceCreate'; // AdvicePostForm 컴포넌트 import
import Pagination from '../common/Pagination';

const AdviceBoard = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostForm, setShowPostForm] = useState(false); // showPostForm 상태 변수 추가
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts'); // axios로 GET 요청 보내기
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleCreatePost = () => {
    setShowPostForm(true); // "작성하기" 버튼 클릭 시 AdvicePostForm을 보여주도록 상태 변경
  };

  return (
    <div>
      {/* "작성하기" 버튼을 클릭하면 AdvicePostForm 컴포넌트를 렌더링 */}
      {showPostForm ? (
        <AdvicePostForm />
      ) : (
        <button onClick={handleCreatePost}>작성하기</button>
      )}

      {currentPosts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}

      <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / postsPerPage)} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdviceBoard;
