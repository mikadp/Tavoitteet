package main

import (
	"backend/database"
	"backend/models"
	"backend/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// Yhdistä tietokantaan
	database.Connect()

	// Suorita migraatiot
	database.DB.AutoMigrate(&models.User{})

	// Luo Gin-palvelin
	r := gin.Default()

	// Lisää CORS-otsikot vastauksiin
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},          //Frontend
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"}, // Sallitut HTTP-metodit
		AllowHeaders:     []string{"Content-Type"},                   // Sallitut HTTP-otsikot
		AllowCredentials: true,                                       // Evästeiden sallinta
	}))

	// Perusreitti tarkistukseen
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Backend is running!")
	})

	// API-reitit käyttäjille
	users := r.Group("/api/users")
	{
		users.GET("/", routes.GetUsers)
		users.POST("/", routes.CreateUser)
		users.PATCH("/:id", routes.UpdateUserActiveStatus)
		users.DELETE("/:id", routes.DeleteUser)
	}

	// API-reitit tavoitteille
	goals := r.Group("/api/goals")
	{
		goals.GET("/", routes.GetGoals)
		goals.POST("/", routes.CreateGoal)
	}

	// Käynnistä palvelin
	log.Println("Starting backend server on port 8080...")
	err := r.Run(":8080") // Käynnistä Gin-palvelin portissa 8080
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
