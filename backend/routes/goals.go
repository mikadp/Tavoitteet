package routes

import (
	"backend/database"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/mux"
)

// Get all goals
func GetGoals(c *gin.Context) {
	var goals []models.User
	database.DB.Find(&goals)
	c.JSON(http.StatusOK, gin.H{"data": goals})
}

// Create a new goal
func CreateGoal(c *gin.Context) {
	var goal models.User
	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&goal)
	c.JSON(http.StatusOK, gin.H{"data": goal})
}

// Delete goal (optional)
func DeleteGoal(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	database.DB.Delete(&models.User{}, id)
	w.WriteHeader(http.StatusNoContent)
}
