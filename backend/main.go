package main

import (
	"backend/database"
	"backend/models"
	"backend/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {

	// Yhdistä tietokantaan
	database.Connect()

	// Suorita migraatiot
	database.DB.AutoMigrate(&models.User{})

	// Luo Gin-palvelin
	r := gin.Default()

	// Perusreitti tarkistukseen
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Backend is running!")
	})

	// API-reitit
	r.GET("/api/goals", routes.GetGoals)
	r.POST("/api/goals", routes.CreateGoal)
	r.GET("/users", func(c *gin.Context) {
		routes.GetUsers(c.Writer, c.Request)
	})
	r.POST("/users", func(c *gin.Context) {
		routes.CreateUser(c.Writer, c.Request)
	})
	r.PATCH("/users/:id", func(c *gin.Context) {
		routes.UpdateUserActiveStatus(c.Writer, c.Request)
	})
	r.DELETE("/users/:id", func(c *gin.Context) {
		routes.DeleteUser(c.Writer, c.Request)
	})

	// Käynnistä palvelin
	log.Println("Starting backend server on port 8080...")
	err := r.Run(":8080") // Käynnistä Gin-palvelin portissa 8080
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
