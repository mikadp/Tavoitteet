package models

import (
	"time"
)

// user model
type User struct {
	ID        uint      `gorm:"primaryKey"`
	Username  string    `gorm:"unique;not null" json:"username"` //Name of the user
	Password  string    `gorm:"not null" json:"-"`               //Password of the user
	Role      string    `gorm:"default:false" json:"role"`       //Role of the user
	Goals     []Goal    `gorm:"foreignKey:UserID"`               //Relationship to goals
	CreatedAt time.Time `gorm:"autoCreateTime"`                  //Created time of the user
	UpdatedAt time.Time `gorm:"autoUpdateTime"`                  //Updated time of the user
}
