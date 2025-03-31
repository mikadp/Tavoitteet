package main

import (
	"backend/database"
	"backend/middleware"
	"backend/models"
	"backend/routes"
	"log"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// Yhdistä tietokantaan
	database.Connect()

	// Suorita migraatiot
	err := database.DB.AutoMigrate(&models.User{}, &models.Goal{})
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Luo Gin-palvelin
	r := gin.Default()

	// Lisää CORS-otsikot vastauksiin
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},          //Frontend
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"}, // Sallitut HTTP-metodit
		AllowHeaders:     []string{"Content-Type", "Authorization"},  // Sallitut HTTP-otsikot
		AllowCredentials: true,                                       // Evästeiden sallinta
	}))

	// Palvele staattisia tiedostoja (frontend)
	frontendPath := "./frontend/build"
	r.Static("/static", filepath.Join(frontendPath, "static"))
	r.NoRoute(func(c *gin.Context) {
		c.File(filepath.Join(frontendPath, "index.html"))
	})

	// Perusreitti tarkistukseen
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Backend is running!")
	})

	//API-reitit
	api := r.Group("/api")
	{
		// Julkiset reitit
		api.POST("/register", routes.Register)
		api.POST("/login", routes.Login)

		// reitit käyttäjätietojen hakemiseen
		api.GET("/me", middleware.RequireAuth, routes.GetCurrentUser)

		//logout-reitti tbd
		//api.POST("/logout", middleware.RequireAuth, routes.Logout)

		// API-reitit admin-käyttöön
		users := api.Group("/users")
		users.Use(middleware.RequireAuth) // Käytä middlewarea kaikissa käyttäjäreiteissä
		{
			users.GET("/", routes.GetUsers)    // Admin: Hae kaikki käyttäjät
			users.POST("/", routes.CreateUser) // Admin: Luo uusi käyttäjä
			users.DELETE("/:id", routes.DeleteUser)
		}

		// API-reitit tavoitteille
		goals := api.Group("/goals")
		goals.Use(middleware.RequireAuth) // Käytä middlewarea kaikissa tavoitereiteissä
		{
			goals.GET("/", routes.GetUserGoals)
			goals.POST("/", routes.CreateGoal)
			goals.DELETE("/:id", routes.DeleteGoal)
		}
	}

	//Ohjaa kaikki reitit frontendille
	r.NoRoute(func(c *gin.Context) {
		c.File(filepath.Join(frontendPath, "index.html"))
	})

	// Käynnistä palvelin
	log.Println("Starting backend server on port 8080...")
	err = r.Run(":8080") // Käynnistä Gin-palvelin portissa 8080
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
