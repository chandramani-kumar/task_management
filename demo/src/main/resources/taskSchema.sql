DROP TABLE IF EXISTS task_items;

-- =================================================================
--  Table for Tasks
-- =================================================================
CREATE TABLE IF NOT EXISTS task_items (
    id BIGSERIAL PRIMARY KEY,                      -- Auto-incrementing 64-bit integer primary key
    number VARCHAR(50) UNIQUE NOT NULL,            -- A unique identifier for the task, e.g., "TASK-123"
    title VARCHAR(255) NOT NULL,                   -- The main title of the task
    status VARCHAR(50) NOT NULL,                   -- Task status, e.g., 'initiated', 'in_progress', 'done'
    priority VARCHAR(50) NOT NULL,                 -- Task priority, e.g., 'High', 'Medium', 'Low'
    assignee VARCHAR(255),                         -- The user or team member assigned to the task
    description TEXT,                              -- A detailed description of the task in plain text
    description_rich_text TEXT,                    -- A description that can contain rich text/HTML
    due_date TIMESTAMP WITH TIME ZONE,             -- The date and time when the task is due
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp of when the task was created
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp of the last update
    deleted_at TIMESTAMP WITH TIME ZONE            -- Timestamp for soft deletion; NULL if not deleted
);


-- =================================================================
--  Indexes for Performance and Correctness
-- =================================================================
-- This is the crucial change: A unique index on 'number' that only applies
-- to rows that have NOT been soft-deleted.
CREATE UNIQUE INDEX unique_task_number_when_not_deleted
ON task_items (number)
WHERE (deleted_at IS NULL);

-- Create a non-unique index for soft-deleted items to allow multiple nulls
CREATE INDEX idx_task_number_when_deleted
ON task_items (number)
WHERE (deleted_at IS NOT NULL);


-- Other performance indexes
CREATE INDEX idx_task_item_id ON task_comments(task_item_id);
CREATE INDEX idx_task_status ON task_items(status);
CREATE INDEX idx_task_priority ON task_items(priority);