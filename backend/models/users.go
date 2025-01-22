package models

import (
	"time"
)

// user model
type User struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`          //Name of the user
	Goals     []Goal    `gorm:"foreignKey:UserID"` //Relationship to goals
	IsActive  bool      `gorm:"default:false"`     //Active status
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
