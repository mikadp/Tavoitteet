package routes

import (
	"backend/database"
	"backend/models"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Get all goals (only for admin)
func GetGoals(c *gin.Context) {
	var goals []models.Goal
	database.DB.Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Get goals for a specific user
func GetUserGoals(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}

	var goals []models.Goal
	database.DB.Where("user_id = ?", userID).Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Create a new goal
func CreateGoal(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unauthorized"})
		return
	}

	var input struct {
		GoalName   string `json:"goal_name"`
		TargetDate string `json:"target_date"`
		Repetition string `json:"repetition"`
	}

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

	// if date is not valid or in the past, return error
	if parsedDate.Before(time.Now()) {
		log.Println("Invalid date, date is in the past:", parsedDate)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date, date is in the past"})
		return
	}

	//Ensure that user ID is correct
	uid, ok := userID.(uint)
	if !ok {
		log.Println("Invalid user ID:", userID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Create new goal struct for database
	goal := models.Goal{
		UserID:      uid,
		GoalName:    input.GoalName,
		TargetDate:  parsedDate,
		Repetition:  input.Repetition,
		Description: "Ei kuvausta",
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
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	goalID := c.Param("id")
	var goal models.Goal
	if err := database.DB.Where("id = ? AND user_id = ?", goalID, userID).First(&goal).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Goal not found!"})
		return
	}

	database.DB.Delete(&goal)
	c.JSON(http.StatusOK, gin.H{"message": "Goal deleted successfully!"})

}
