import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./IssueDetail.module.css";
import CommentCreate from "../common/CommentCreate";
import tokenHttp from "../../../api/tokenHttp";
import CommentList from "../common/CommentList";
// import NavBar from "../../common/NavBar";

function IssueDetail() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState();
  const [comments, setComments] = useState([]);
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const showbutton = (nickname) => {
    return userdata && userdata.nickname === nickname;
  };
  const navigate = useNavigate();

  useEffect(() => {
    getIssueDetail();
    getCommentList();
  }, []);

  useEffect(() => {
    console.log("==========", issue);
  }, [issue])

  const getIssueDetail = async () => {
    try {
      const response = await tokenHttp.get(`/issue/${issueId}`);
      console.log("issue response", response);
      const data = response.data.data;
      console.log("data", data);
      setIssue({...data});  
    } catch (error) {
      console.error("Error fetching issue detail:", error);
    }
  };

  const getCommentList = async () => {
    try {
      const response = await tokenHttp.get(`/comment/ISSUE/${issueId}`);
      const commentData = response.data.data;
      setComments(commentData); // 댓글 목록 데이터 설정
    } catch (error) {
      console.error("Error fetching comment list:", error);
    }
  };


  const handleUpdateComment = async (commentId, content) => {
    try {
      // 댓글 수정 로직 구현
      const response = await tokenHttp.put(`/comment/${commentId}`, { content: content });
      console.log("Edit comment response:", response);
  
      // 댓글 목록을 다시 가져와서 업데이트
      getCommentList();

    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  
  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await tokenHttp.delete(`/comment/${commentId}`);
      console.log("Delete comment response:", response);
      
      
      const updatedComments = comments.filter(comment => comment.commentId !== commentId);
      setComments(updatedComments);
  
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  // 글 삭제 (수정은 불가)
    const handleDelete = async (issueId) => {
      try {
        await tokenHttp.delete(`issue/${issueId}`);

        // 글 삭제 후 해당 경로로 이동
        navigate("/community/issue");
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    };


  // 투표 기능 추가
  
const handleAgree = async () => {
  try {
    const response = await tokenHttp.post(`/issue/vote/${issueId}`, { isAgree: true });
    console.log("Agree response:", response);

    // Issue 데이터 업데이트
    setIssue((prevIssue) => ({
      ...prevIssue,
      isAgree: true,
      agreeCount: prevIssue.agreeCount + 1,
    }));
  } catch (error) {
    console.error("Error agreeing to issue:", error);
  }
};

const handleOppose = async () => {
  try {
    const response = await tokenHttp.post(`/issue/vote/${issueId}`, { isAgree: false });
    console.log("Oppose response:", response);

    // Issue 데이터 업데이트
    setIssue((prevIssue) => ({
      ...prevIssue,
      isAgree: false,
      opposeCount: prevIssue.opposeCount + 1,
    }));
  } catch (error) {
    console.error("Error opposing issue:", error);
  }
};

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (

      <div>
      <div className={styles.issueDetailContainer}>
        <button>

          {showbutton(issue.nickname) && (
                    <div >
                      
                      <div>
                        <span onClick={() => handleDelete(issue.issueId)}>
                          Delete
                        </span>
                      </div>
                    </div>
                  )}
        </button>

        <h1>{issue.title}</h1>
        <p>작성자: {issue.nickname}</p>

        <p>
          {issue.agreeTitle} {issue.agreeCount}{" "}
          <button onClick={handleAgree}>찬성</button>
        </p>
        <p>
          {issue.opposeTitle} {issue.opposeCount}{" "}
          <button onClick={handleOppose}>반대</button>
        </p>

      <CommentCreate boardTypeProp="ISSUE" boardIdProp={issue.issueId} getCommentList={getCommentList}/>
      
      <CommentList comments={comments}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />


    </div>
    </div>
  );
}

export default IssueDetail;
