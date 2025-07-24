import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import APIService from '../services/api';
import EditTaskModal from '../components/EditTaskModal';
import ActivityFeed from '../components/ActivityFeed'; // Import the new component
import './TaskDetailPage.css';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchTask = useCallback(async () => {
    setLoading(true);
    const response = await APIService.getTaskById(id);
    if (response.success) {
      setTask(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task permanently?')) {
      const response = await APIService.deleteTask(id);
      if (response.success) {
        navigate('/');
      } else {
        alert(`Failed to delete task: ${response.error}`);
      }
    }
  };

  const handleUpdateTask = async (updatedTaskData) => {
    const payload = { ...updatedTaskData, dueDate: updatedTaskData.dueDate || null };
    const response = await APIService.updateTask(id, payload);
    if (response.success) {
      setIsEditModalVisible(false);
      fetchTask();
    } else {
      alert(`Failed to update task: ${response.error}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return isNaN(date) ? '--' : date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const DetailItem = ({ label, value }) => (
    <div className="detail-page-item">
      <span className="detail-page-label">{label}</span>
      <span className="detail-page-value">{value || '--'}</span>
    </div>
  );

  if (loading) return <div className="page-container"><p>Loading Task...</p></div>;
  if (error) return <div className="page-container error-container"><p>{error}</p><Link to="/">Go Back</Link></div>;
  if (!task) return <div className="page-container"><p>Task not found.</p><Link to="/">Go Back</Link></div>;

  return (
    <>
      <div className="task-detail-layout">
        <div className="page-container">
          <div className="detail-page-header">
            <h1>{task.title}</h1>
            <div className="header-actions">
              <button onClick={() => setIsEditModalVisible(true)} className="action-button edit-button">Edit</button>
              <button onClick={handleDelete} className="action-button delete-button">Delete</button>
              <Link to="/tasks" className="back-button">← Back</Link>
            </div>
          </div>
          <div className="detail-page-content">
            <h3>General Information</h3>
            <div className="details-grid">
              <DetailItem label="Number" value={task.number} />
              <DetailItem label="Title" value={task.title} />
              <DetailItem label="Assignee" value={task.assignee} />
              <DetailItem label="Status" value={
                  <span className={`status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : ''}`}>
                      {task.status || '--'}
                  </span>
              } />
              <DetailItem label="Priority" value={
                  <span className={`priority-badge ${task.priority ? task.priority.toLowerCase() : ''}`}>
                      {task.priority || '--'}
                  </span>
              } />
              <DetailItem label="Due Date" value={formatDate(task.dueDate)} />
              <DetailItem label="Created At" value={formatDate(task.createdAt)} />
            </div>
            <div className="description-section">
              <h4>Description</h4>
              <p>{task.description || '--'}</p>
            </div>
            <div className="description-section">
              <h4>Rich Text Description</h4>
              <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: task.descriptionRichText || '<p>--</p>' }} />
            </div>
          </div>
        </div>
        
        <ActivityFeed task={task} />
      </div>

      {isEditModalVisible && (
        <EditTaskModal
          task={task}
          onSave={handleUpdateTask}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </>
  );
};

export default TaskDetailPage;
