import axios from 'axios';

// Luo axios instanssi perus-URL:llä
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Käyttäjä-API 
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