import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./IssueDetail.module.css";
import CommentCreate from "../common/CommentCreate";
import tokenHttp from "../../../api/tokenHttp";
import CommentList from "../common/CommentList";
import NavBar from "../../common/NavBar";
import FriendButton from "../../common/FriendButton";

import AuthenticationCheck from "../../../util/Auth";

import Swal from "sweetalert2";

function IssueDetail() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState();
  const [comments, setComments] = useState([]);
  const [myLike, setMyLike] = useState([]);
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);
  const showbutton = (nickname) => {
    return userdata && userdata.nickname === nickname;
  };
  const navigate = useNavigate();

  // 영역 비율 계산
  const [agreeRatio, setAgreeRatio] = useState(50); // 초기에 50%로 설정
  const [opposeRatio, setOpposeRatio] = useState(50); // 초기에 50%로 설정

  useEffect(() => {
    getIssueDetail();
    getCommentList();
    getLikeList();
  }, []);

  useEffect(() => {}, [issue]);

  const getIssueDetail = async () => {
    try {
      const response = await tokenHttp.get(`/issue/${issueId}`);
      const data = response.data.data;
      setIssue({ ...data });
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

  const getLikeList = async () => {
    try {
      const response = await tokenHttp.get(`/comment/like/ISSUE/${issueId}`);
      const likeData = response.data.data;
      setMyLike(likeData);
    } catch (error) {
      console.error("Error fetching comment like list:", error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      // 댓글 수정 로직 구현
      const response = await tokenHttp.put(`/comment/${commentId}`, {
        content: content,
      });
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
      const updatedComments = comments.filter(
        (comment) => comment.commentId !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 글 삭제 (수정은 불가)
  const handleDelete = async (issueId) => {
    try {
      Swal.fire({
        title: "삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        width: 400,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await tokenHttp.delete(`issue/${issueId}`);
          // Swal.fire({ title: "글이 정상적으로 \n삭제되었습니다", width: 400 });
          // 글 삭제 후 해당 경로로 이동
          navigate("/community/issue");
        }
      });
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleAgree = async () => {
    try {
      const response = await tokenHttp.post(`/issue/vote/${issueId}`, {
        isAgree: true,
      });

      // Issue 데이터 업데이트
      setIssue((prevIssue) => ({
        ...prevIssue,
        isAgree: true,
        agreeCount: prevIssue.agreeCount + 1,
      }));
      getIssueDetail();
    } catch (error) {
      console.error("Error agreeing to issue:", error);
    }

    // 투표 후 비율 업데이트
    const totalVotes = issue.agreeCount + issue.opposeCount + 1;
    const newAgreeRatio = ((issue.agreeCount + 1) / totalVotes) * 100;
    const newOpposeRatio = 100 - newAgreeRatio;
    setAgreeRatio(newAgreeRatio);
    setOpposeRatio(newOpposeRatio);
  };

  const handleOppose = async () => {
    try {
      const response = await tokenHttp.post(`/issue/vote/${issueId}`, {
        isAgree: false,
      });

      // Issue 데이터 업데이트
      setIssue((prevIssue) => ({
        ...prevIssue,
        isAgree: false,
        opposeCount: prevIssue.opposeCount + 1,
      }));
      getIssueDetail();
    } catch (error) {
      console.error("Error opposing issue:", error);
    }

    const totalVotes = issue.agreeCount + issue.opposeCount;
    const newOpposeRatio = ((issue.opposeCount + 1) / totalVotes) * 100;
    const newAgreeRatio = 100 - newOpposeRatio;
    setOpposeRatio(newOpposeRatio);
    setAgreeRatio(newAgreeRatio);
  };

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.issueBoardBackground}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
      <div className={styles.issueBoardContainer}>
        <div className={styles.issueDetailContainer}>
          <div className={styles.buttonContainer}>
            <button className={styles.listButton} onClick={() => navigate(-1)}>
              <span>목록</span>
            </button>
            {showbutton(issue.nickname) && (
              <button className={styles.deleteButton}>
                <div>
                  <span onClick={() => handleDelete(issue.issueId)}>삭제</span>
                </div>
              </button>
            )}
          </div>
          <div>
            <h1>{issue.title}</h1>
            <p>작성자: {issue.nickname}</p>
          </div>

          {/* 투표기능 */}
          <div className={styles.voteContainer}>
            <button className={styles.leftVoteButton} onClick={handleAgree}>
              {issue.agreeTitle} <br></br>
              {issue.agreeCount} 표
            </button>
            <div className={styles.voteArea}>
              <div
                className={styles.agreeArea}
                style={{ flex: issue.agreeCount }}
              ></div>
              <div
                className={styles.opposeArea}
                style={{ flex: issue.opposeCount }}
              ></div>
            </div>
            <button className={styles.rightVoteButton} onClick={handleOppose}>
              {issue.opposeTitle} <br></br>
              {issue.opposeCount} 표
            </button>
          </div>

          <div className={styles.issueContent}>{issue.content}</div>
          <CommentCreate
            boardTypeProp="ISSUE"
            boardIdProp={issue.issueId}
            getCommentList={getCommentList}
          />

          <CommentList
            boardType="ISSUE"
            comments={comments}
            myLike={myLike}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;
