package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	gomail "gopkg.in/mail.v2"
)

var db *sql.DB
var calendarService *calendar.Service
var oauth2Config *oauth2.Config
var oauth2Token *oauth2.Token

// Structs for JSON requests
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	UserType string `json:"userType"`
}

type Reservation struct {
	ID      int    `json:"id"`
	Start   string `json:"start"`
	End     string `json:"end"`
	Title   string `json:"title"`
	Email   string `json:"email"`
	Minutes int    `json:"minutes"`
	UserID  int    `json:"userId"`
}

func main() {
	// Database connection
	var err error
	db, err = sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize Google OAuth2
	oauth2Config = &oauth2.Config{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URI"),
		Scopes:       []string{calendar.CalendarScope},
		Endpoint:     google.Endpoint,
	}

	// Router setup
	router := mux.NewRouter()

	// CORS Middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	}).Handler(router)

	// Routes
	router.HandleFunc("/auth/google", handleGoogleAuth).Methods("GET")
	router.HandleFunc("/auth/google/callback", handleGoogleAuthCallback).Methods("GET")
	router.HandleFunc("/api/v1/users", getUsers).Methods("GET")
	router.HandleFunc("/api/v1/users", createUser).Methods("POST")
	router.HandleFunc("/api/v1/users/{id}", updateUser).Methods("PUT")
	router.HandleFunc("/api/v1/users/{id}", deleteUser).Methods("DELETE")
	router.HandleFunc("/api/v1/users/{userId}/reservations", createReservation).Methods("POST")

	// Start the server
	log.Println("Starting server on port 3000")
	log.Fatal(http.ListenAndServe(":3000", corsHandler))
}

// Google OAuth2 Handler
func handleGoogleAuth(w http.ResponseWriter, r *http.Request) {
	authURL := oauth2Config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

func handleGoogleAuthCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := oauth2Config.Exchange(oauth2.NoContext, code)
	if err != nil {
		http.Error(w, "Failed to get token", http.StatusBadRequest)
		return
	}
	oauth2Token = token

	// Initialize Google Calendar Service
	client := oauth2Config.Client(oauth2.NoContext, token)
	calendarService, err = calendar.New(client)
	if err != nil {
		http.Error(w, "Failed to create calendar service", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Google authentication successful!")
}

// Get Users
func getUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.UserType); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// Create User
func createUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)", user.Username, user.Email, user.Password, user.UserType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "User created successfully")
}

// Update User
func updateUser(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?", user.Username, user.Email, user.Password, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "User updated successfully")
}

// Delete User
func deleteUser(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	_, err := db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "User deleted successfully")
}

// Create Reservation
func createReservation(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]

	var reservation Reservation
	if err := json.NewDecoder(r.Body).Decode(&reservation); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO reservations (start, end, title, email, minutes, userId) VALUES (?, ?, ?, ?, ?, ?)",
		reservation.Start, reservation.End, reservation.Title, reservation.Email, reservation.Minutes, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send email using gomail
	m := gomail.NewMessage()
	m.SetHeader("From", "your-email@gmail.com")
	m.SetHeader("To", reservation.Email)
	m.SetHeader("Subject", "Reservation Created")
	m.SetBody("text/plain", "Your reservation has been created.")

	d := gomail.NewDialer("smtp.gmail.com", 587, "your-email@gmail.com", "your-email-password")

	if err := d.DialAndSend(m); err != nil {
		http.Error(w, "Failed to send email", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "Reservation created successfully and email sent")
}
