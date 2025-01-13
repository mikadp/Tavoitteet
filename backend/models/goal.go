package models

import (
	"time"
)

type Goal struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     string    `gorm:"not null"` //Foreign key to user
	GoalName   string    `gorm:"not null"`
	TargetDate time.Time `gorm:"not null"`
	Achieved   bool      `gorm:"default:false"`
	Repetition string    `json:"repetition"` // e.g., "daily", "weekly", "monthly"
	CreatedAt  time.Time
	UpdatedAt  time.Time
	User       User `gorm:"foreignKey:UserID"` //Relationship to user
}
