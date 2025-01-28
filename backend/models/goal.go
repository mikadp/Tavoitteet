package models

import (
	"time"
)

type Goal struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"` //Foreign key to user
	GoalName    string    `gorm:"not null" json:"goal_name"`
	Description string    `json:"description"`
	TargetDate  time.Time `gorm:"not null" json:"target_date"` // e.g., "2021-12-31"
	Achieved    bool      `gorm:"default:false" json:"achieved"`
	Repetition  string    `json:"repetition"` // e.g., "daily", "weekly", "monthly"
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
