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

// Create a new goal
func CreateGoal(c *gin.Context) {
	var goal models.Goal
	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&goal)
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
