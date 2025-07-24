DROP TABLE IF EXISTS task_comments;

-- =================================================================
--  Table for Comments on Tasks
-- =================================================================
CREATE TABLE IF NOT EXISTS task_comments (
    id BIGSERIAL PRIMARY KEY,                      -- Auto-incrementing 64-bit integer primary key
    task_item_id BIGINT NOT NULL,                  -- Foreign key referencing the task this comment belongs to
    user_name VARCHAR(255),                        -- The name of the user who posted the comment
    comment TEXT NOT NULL,                         -- The content of the comment
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp of when the comment was created
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp of the last update

    -- Constraint to link this comment to a task in the task_items table
    CONSTRAINT fk_task_item
        FOREIGN KEY(task_item_id)
        REFERENCES task_items(id)
        ON DELETE CASCADE -- If a task is deleted, its comments are also deleted
);