package routes

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get all users
func GetUsers(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// Create a new user
func CreateUser(c *gin.Context) {
	var user models.User
	// Validate the input
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	// Validate that name is not empty
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Create user
	database.DB.Create(&user)
	c.JSON(http.StatusCreated, gin.H{"data": user})
}

// Update user active status
func UpdateUserActiveStatus(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	// Check if the user exists
	if err := database.DB.First(&user, id); err.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Set all other users to inactive
	database.DB.Model(&models.User{}).Update("Active", false)

	// Set the user to active
	user.Active = true
	database.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// Delete user
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.User{}, id); err.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}
	c.Status(http.StatusNoContent)
}
