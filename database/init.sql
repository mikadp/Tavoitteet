CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    goal_name VARCHAR(100) NOT NULL,
    target_date DATE NOT NULL,
    repetition VARCHAR(10) NOT NULL CHECK (repetition IN ('daily', 'weekly', 'monthly'))
);

CREATE TABLE user_goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id),
    UNIQUE (user_id, goal_id)   
);

CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    goal_id INT NOT NULL,
    done_date DATE NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);
