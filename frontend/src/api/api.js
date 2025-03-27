import axios from 'axios';

// Debug log to verify the API URL
console.log("API Base URL:", process.env.REACT_APP_API_URL);

/*const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});*/

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Käyttäjä-API 
export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const fetchUsers = () => api.get("/users/");                // Hakee kaikki käyttäjät
export const createUser = (data) => api.post("/users/", data);     // Luo uuden käyttäjän
export const updateUserStatus = (id) => api.patch(`/users/${id}`); // Päivittää käyttäjän tilan
export const deleteUser = (id) => api.delete(`/users/${id}`);      // Poistaa käyttäjän
export const fetchUserProfile = () => api.get("/me");              // Hakee käyttäjän profiilin
    
// Tavoitteet-API
export const fetchGoals = () => api.get("/goals/");                // Hakee kaikki tavoitteet
export const createGoal = (data) => api.post("/goals/", data);     // Luo uuden tavoitteen
export const deleteGoal = (id) => api.delete(`/goals/${id}`);      // Poistaa tavoitteen
export const fetchActiveUserGoals = () => api.get("/goals/active"); // Hakee aktiivisen käyttäjän tavoitteet

// User specific goals
export const getUserGoals = (token) => api.get("/goals/user", { headers: { Authorization: `Bearer ${token}`,},});

export default api;