package routes

import (
	"backend/database"
	"backend/models"
	"fmt"
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
	// Create user
	fmt.Println("User data received: ", user)
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
	if err := database.DB.Model(&models.User{}).Where("id != ?", id).Update("IsActive", false).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deactivate other users"})
		return
	}

	// Set the user to active
	user.IsActive = true
	if err := database.DB.Model(&user).Where("id = ?", id).Updates(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

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
