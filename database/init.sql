CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT FALSE
    );
    
CREATE UNIQUE INDEX unique_active_user ON users (id) WHERE IsActive = FALSE;

CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,    --Foreign key to users
    goal_name VARCHAR(100) NOT NULL,                                --goal name
    description TEXT,                                               -- Optional description
    target_date DATE NOT NULL,                                      -- Target date
    achieved BOOLEAN DEFAULT FALSE,                                 -- is goal achieved
    repetition VARCHAR(10) NOT NULL CHECK (repetition IN ('daily', 'weekly', 'monthly')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    goal_id INT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    done_date DATE NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    UNIQUE (goal_id, done_date) -- Ei samaa tavoitetta ja päivämäärää useasti
);
