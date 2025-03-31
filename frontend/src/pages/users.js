import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUserStatus, deleteUser } from "../api/api";

const Users = () => {
    const [users, setUsers] = useState([]); // List of users, initially empty
    const [newUserName, setNewUserName] = useState('');
    const [loading, setLoading] = useState(true); // For loading animation
    const [error, setError] = useState(''); // For error messages

    useEffect(() => {
        console.log("Users state updated:", users); // check the users state
    }, [users]); // Hook to log the users state allways when it changes

    const loadUsers = async () => {
        try {
            setLoading(true); //Starts the loading animation
            console.log('Loading users...');
            const response = await fetchUsers();
            console.log('Loaded users from api:', response.data); // Check the response data
            setUsers(Array.isArray(response.data.data) ? response.data.data : []); // Ensure the data is an array
            console.log('Users:', users); // Check the users state
        } catch (error) {
            setError('Käyttäjien lataaminen epäonnistui'); // Show an error message
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Stops the loading animation
        }
    };

    useEffect(() => {
        loadUsers(); // Fetch the users when the component is first rendered
    }, []);

    const handleCreateUser = async () => {
        if (!newUserName.trim()) {
            alert('Käyttäjän nimi ei voi olla tyhjä');
            return;
        }
        try {
            await createUser({ Username: newUserName }); 
            setNewUserName(''); // clear the input field
            loadUsers(); // fetch the updated list of users
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleDeleteUser = async (ID) => {
        try {
            await deleteUser(ID);
            loadUsers(); // fetch the updated list of users
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const noUsers = users.length === 0;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Käyttäjähallinta</h1>
            {/*show loading animation while fetching data */}
            {loading ? (
                <div className="flex items-center justify-center">
                <div className="spinner border-t-4 border-blue-500 w-8 h-8 rounded-full animate-spin"></div>
                <p>Ladataan...</p>
                </div>
            ) : noUsers ? (
                <p>Ei käyttäjiä</p>
            ) : (
            // Show the list of users
            <ul className="mb-4">
                {users.map((user) => (
                        <li
                            key={user.ID}
                            className="border p-2 mb-2 rounded flex justify-between"
                        >
                            {user.Name}
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={() => handleDeleteUser(user.ID)}
                            >
                                Poista käyttäjä
                            </button>
                            </li>
                    ))}
                    </ul>
            )}
            {/* Create a new user */}
            <div>
                <h2 className="text-xl font-bold mb-2">Luo uusi käyttäjä</h2>
                <input
                    type="text"
                    placeholder="Käyttäjän nimi"
                    value={newUserName}
                    onChange={(event) => setNewUserName(event.target.value)}
                    className="border p-2 mb-2 rounded"
                    />
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
                        onClick={handleCreateUser}>Lisää käyttäjä
                    </button>
            </div>
        </div>
    );
};

export default Users;