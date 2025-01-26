package routes

import (
	"backend/database"
	"backend/models"
	"log"
	"net/http"

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
	var goal models.Goal
	var IsActive models.User

	// Find active user
	if err := database.DB.Where("is_active = ?", true).First(&IsActive).Error; err != nil {
		log.Println("Active user not found", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Active user not found"})
		return
	}
	log.Println("Active user found", IsActive)

	// Validate input
	if err := c.ShouldBindJSON(&goal); err != nil {
		log.Println("Invalid JSON data", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON data"})
		return
	}
	log.Println("Goal data", goal)

	// Validate required fields
	if goal.GoalName == "" || goal.TargetDate == "" || goal.Repetition == "" {
		log.Println("Missing required fields", goal)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}
	// set default values
	goal.UserID = IsActive.ID
	if goal.Description == "" {
		goal.Description = "Ei kuvausta"
	}

	log.Println("Goal data before save:", goal)

	// Set the user_id field to the active user's ID
	goal.UserID = IsActive.ID
	if err := database.DB.Create(&goal).Error; err != nil {
		log.Println("Failed to create goal:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create goal"})
		return
	}

	log.Println("Goal created successfully", goal)
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
