package models

import (
	"time"
)

type Goal struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"` //Foreign key to user
	GoalName    string    `gorm:"not null" json:"goal_name"`
	Description string    `json:"description"`
	TargetDate  string    `gorm:"not null;type:date" json:"target_date"`
	Achieved    bool      `gorm:"default:false" json:"achieved"`
	Repetition  string    `json:"repetition"` // e.g., "daily", "weekly", "monthly"
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
