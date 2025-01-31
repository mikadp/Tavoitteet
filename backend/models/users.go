package models

import (
	"time"
)

// user model
type User struct {
	ID        uint      `gorm:"primaryKey"`
	Username  string    `gorm:"not null" json:"username"`       //Name of the user
	Password  string    `gorm:"not null" json:"-"`              //Password of the user
	Role      string    `gorm:"default:'user'" json:"role"`     //Role of the user
	Goals     []Goal    `gorm:"foreignKey:UserID"`              //Relationship to goals
	IsActive  bool      `gorm:"default:false" json:"is_active"` //Active status
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
