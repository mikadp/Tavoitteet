package models

import (
	"time"
)

type User struct {
	ID         uint      `gorm:"primaryKey"`
	User       string    `gorm:"not null"`
	GoalName   string    `gorm:"not null"`
	TargetDate time.Time `gorm:"not null"`
	Achieved   bool      `gorm:"default:false"`
	Active     bool      `gorm:"default:true"`
	Repetition string    `json:"repetition"` // e.g., "daily", "weekly", "monthly"
	CreatedAt  time.Time
}
