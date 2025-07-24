import React, { useState, useEffect } from 'react';
import APIService from '../services/api';
import './ActivityFeed.css';

const ActivityFeed = ({ task }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (task && task.id) {
      setLoadingComments(true);
      APIService.getCommentsForTask(task.id).then(response => {
        if (response.success) {
          // The backend returns comments, but the task object also has them.
          // We can use the ones from the task object directly to avoid another fetch.
          setComments(task.comments || []);
        }
        setLoadingComments(false);
      });
    }
  }, [task]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!task.assignee || task.assignee === 'None') {
      alert('Please select an Assignee for the task before commenting.');
      return;
    }

    const commentData = {
      userName: task.assignee, 
      comment: newComment,
    };

    const response = await APIService.createComment(task.id, commentData);
    if (response.success) {
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment(''); // Clear the input field
    } else {
      alert(`Failed to post comment: ${response.error}`);
    }
  };
  
  const formatCommentTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="activity-feed-panel">
      <div className="activity-feed-header">
        <h4>Activity Feed</h4>
      </div>
      <div className="activity-feed-body">
        <div className="comment-input-area">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add comment"
          />
          <button onClick={handlePostComment} className="post-comment-btn">
            <span>&gt;</span>
          </button>
        </div>
        <div className="comment-list">
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">{comment.userName ? comment.userName.substring(0, 2).toUpperCase() : '??'}</div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-time">{formatCommentTime(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
