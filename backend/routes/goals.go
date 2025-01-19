package routes

import (
	"backend/database"
	"backend/models"
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
	var active models.User

	// Find active user
	if err := database.DB.Where("active = ?", true).First(&active); err.Error != nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.Goal{}})
		return
	}

	var goals []models.Goal
	database.DB.Where("user_id = ?", active.ID).Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Create a new goal
func CreateGoal(c *gin.Context) {
	var goal models.Goal

	// Find active user
	var active models.User
	if err := database.DB.Where("active = ?", true).First(&active); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Active user not found"})
		return
	}

	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON data"})
		return
	}

	if goal.GoalName == "" || goal.TargetDate.IsZero() || goal.Repetition == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Set the user_id field to the active user's ID
	goal.UserID = active.ID
	database.DB.Create(&goal)
	c.JSON(http.StatusOK, gin.H{
		"message": "Goal created successfully",
		"data": gin.H{
			"goal": goal,
			"user": active.Name,
		},
	})
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
