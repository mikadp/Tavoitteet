package routes

import (
	"backend/database"
	"backend/models"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Get all goals
func GetGoals(c *gin.Context) {
	var goals []models.Goal
	database.DB.Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Get goals by active user
func GetActiveUserGoals(c *gin.Context) {
	var IsActive models.User

	// Find active user
	if err := database.DB.Where("is_active = ?", true).First(&IsActive); err.Error != nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.Goal{}})
		return
	}

	var goals []models.Goal
	database.DB.Where("user_id = ?", IsActive.ID).Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Create a new goal
func CreateGoal(c *gin.Context) {

	var input struct {
		GoalName   string `json:"goal_name"`
		TargetDate string `json:"target_date"`
		Repetition string `json:"repetition"`
	}

	var IsActive models.User
	var goal models.Goal

	// Find active user
	if err := database.DB.Where("is_active = ?", true).First(&IsActive).Error; err != nil {
		log.Println("Active user not found", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Active user not found"})
		return
	}
	log.Println("Active user found", IsActive)

	// Bind JSON -> Input (string)
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Println("Invalid JSON data", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON data"})
		return
	}
	log.Println("Goal data", input)

	// Parse date from string to time.Time
	var parsedDate time.Time
	var err error
	if input.TargetDate != "" {
		parsedDate, err = time.Parse("2006-01-02", input.TargetDate)
		if err != nil {
			log.Println("Invalid date format:", input.TargetDate, err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format, expected YYYY-MM-DD"})
			return
		}
	} else {
		parsedDate = time.Now()
	}

	// Check if the parsed date is valid
	if parsedDate.IsZero() || parsedDate.Month() == 0 || parsedDate.Day() == 0 {
		log.Println("Invalid date:", input.TargetDate)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date"})
		return
	}

	// Create new goal struct for database
	goal = models.Goal{
		UserID:      IsActive.ID,
		GoalName:    input.GoalName,
		TargetDate:  parsedDate,
		Repetition:  input.Repetition,
		Description: "Ei kuvausta",
	}

	// if date is not valid or in the past, return error
	if goal.TargetDate.Before(time.Now()) {
		log.Println("Invalid date, date is in the past:", goal.TargetDate)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date, date is in the past"})
		return
	}
	if goal.TargetDate.IsZero() {
		log.Println("⚠️ Invalid date, date is not set:", goal.TargetDate)
		goal.TargetDate = time.Now()
	}

	// set default values
	goal.UserID = IsActive.ID
	if goal.Description == "" {
		goal.Description = "Ei kuvausta"
	}

	log.Println("Goal data before save:", goal)

	// save to database
	if err := database.DB.Create(&goal).Error; err != nil {
		log.Println("Failed to create goal:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create goal"})
		return
	}

	log.Println("Goal created successfully", goal)

	// Return the created goal
	c.JSON(http.StatusOK, gin.H{"data": goal})

}

// Delete goal (optional)
func DeleteGoal(c *gin.Context) {
	params := c.Param("id")
	if err := database.DB.Delete(&models.Goal{}, params); err.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "Goal deleted successfully"})
}
