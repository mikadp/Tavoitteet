//Used for authentication middleware to protect routes

package middleware

import (
	"backend/database"
	"backend/models"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// RequireAuth checks if the user is authenticated
func RequireAuth(c *gin.Context) {
	// Get Authorization header
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Extract the token
	splitToken := strings.Split(tokenString, "")
	if len(splitToken) != 2 || splitToken[0] != "Bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}
	tokenString = splitToken[1]

	// Parse the token
	claims := &jwt.StandardClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return jwtSecret, nil
	})

	// Check if the token is valid
	if err != nil || !token.Valid {
		log.Println("❌ Invalid token:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Extract user_id from the token
	userID := claims.Subject
	if userID == "" {
		log.Println("❌ Token does not contain user ID")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token, no user ID"})
		c.Abort()
		return
	}

	// Check if the user exists
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		log.Println("❌ User not found", userID)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	// Set user_id in the context
	c.Set("user_id", user.ID)

	// Call handler
	c.Next()

}
