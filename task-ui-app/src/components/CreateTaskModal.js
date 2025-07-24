import React, { useState, useEffect } from 'react';
import './CreateTaskModal.css'; // Using its own dedicated CSS file

// --- Dropdown Options ---
const STATUS_OPTIONS = ['Initiated', 'In Progress', 'Completed'];
const ASSIGNEE_OPTIONS = ['None', 'C. Kumar', 'R. Sharma', 'Yongnan Zhou', 'John Smith', 'Sarah Johnson'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const CreateTaskModal = ({ isOpen, onClose, onSave }) => {
  const [newTask, setNewTask] = useState({});

  // Reset the form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setNewTask({
        title: '',
        description: '',
        assignee: ASSIGNEE_OPTIONS[0],
        status: STATUS_OPTIONS[0],
        priority: PRIORITY_OPTIONS[1],
        number: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        dueDate: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.number) {
      alert('Task Number and Title are required.');
      return;
    }
    onSave(newTask);
  };

  // Helper to get the class name for the badge spans
  const getBadgeClassName = (base, value) => {
    if (!value) return `${base}-badge`;
    return `${base}-badge ${base}-${value.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Task</h3>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="create-task-number">Number *</label>
              <input id="create-task-number" type="text" name="number" value={newTask.number} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="create-task-title">Title *</label>
              <input id="create-task-title" type="text" name="title" value={newTask.title} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="create-task-status">Status</label>
              <div className="custom-select-wrapper">
                <span className={getBadgeClassName('status', newTask.status)}>
                  {newTask.status}
                </span>
                <select
                  id="create-task-status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="create-task-priority">Priority</label>
              <div className="custom-select-wrapper">
                <span className={getBadgeClassName('priority', newTask.priority)}>
                  {newTask.priority}
                </span>
                <select
                  id="create-task-priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="create-task-assignee">Assignee(s)</label>
              <select id="create-task-assignee" name="assignee" value={newTask.assignee} onChange={handleChange}>
                {ASSIGNEE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="create-task-due-date">Due Date</label>
              <input id="create-task-due-date" type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} />
            </div>
            <div className="form-field full-width">
              <label htmlFor="create-task-description">Description</label>
              <textarea id="create-task-description" name="description" value={newTask.description} onChange={handleChange}></textarea>
            </div>
          </div>
        </form>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          <button type="button" onClick={handleSubmit} className="submit-task-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
