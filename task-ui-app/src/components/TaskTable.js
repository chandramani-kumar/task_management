import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../services/api';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal'; // Import the Edit modal
import './TaskTable.css';

const TaskTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // --- State for Modals ---
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIService.getAllTasks();
      if (response.success) {
        setTasks(response.data);
        setTotalTasks(response.total);
      } else {
        setError('Failed to fetch tasks from the server.');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIService.searchTasks(searchTerm);
      if (response.success) {
        setTasks(response.data);
        setTotalTasks(response.total);
      } else {
        setError('Failed to search tasks.');
      }
    } catch (err) {
      setError('An error occurred while searching tasks.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchTasks();
      } else {
        fetchTasks();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchTasks, fetchTasks]);

  const handleCreateTask = async (newTaskData) => {
    const payload = { ...newTaskData, dueDate: newTaskData.dueDate || null };
    const response = await APIService.createTask(payload);

    if (response.success) {
        setIsCreateModalVisible(false);
        fetchTasks();
    } else {
        alert(`Failed to create task: ${response.error}`);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
  };

  const handleView = (task) => {
    navigate(`/task/${task.id}`);
  };

  const handleUpdateTask = async (updatedTaskData) => {
    const payload = { ...updatedTaskData, dueDate: updatedTaskData.dueDate || null };
    const response = await APIService.updateTask(payload.id, payload);
    if (response.success) {
        setIsEditModalVisible(false);
        setEditingTask(null);
        fetchTasks();
    } else {
        alert(`Failed to update task: ${response.error}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    const response = await APIService.deleteTask(id);
    if (response.success) {
      fetchTasks();
    } else {
      setError('Failed to delete task.');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (error) {
    return (
      <div className="task-table-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchTasks} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table-container">
      <div className="table-header">
        <div className="search-container">
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          <button className="search-button">🔍</button>
        </div>
        <div>
            <button className="create-task-btn" onClick={() => setIsCreateModalVisible(true)}>
                ＋ Create Task
            </button>
            <button className="filters-button">🔽 Filters</button>
        </div>
      </div>

      {loading ? (
         <div className="loading-container"><div className="loading-spinner"></div><p>Loading tasks...</p></div>
      ) : (
        <>
          <table className="task-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>#</th>
                <th>Title <span className="sort-arrow">↕</span></th>
                <th>Description</th>
                <th>Assignee(s)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="action-btn view-btn" onClick={() => handleView(task)}>View</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                    <div className="task-number">{task.number}</div>
                  </td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.assignee || 'None'}</td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td><span className={`status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : ''}`}>{task.status}</span></td>
                  <td>{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>{tasks.length} of {totalTasks}</span>
            <div className="pagination">
              <span>Page:</span>
              <select value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))}>
                <option value={1}>1</option>
              </select>
              <button disabled={currentPage === 1}>‹</button>
              <button disabled={currentPage === 1}>›</button>
            </div>
          </div>
        </>
      )}

      <CreateTaskModal 
        isOpen={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={handleCreateTask}
      />

      {isEditModalVisible && (
        <EditTaskModal 
            task={editingTask}
            onSave={handleUpdateTask}
            onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default TaskTable;
