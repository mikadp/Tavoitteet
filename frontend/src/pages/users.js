import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUserStatus, deleteUser } from "../api/api";

const Users = () => {
    const [users, setUsers] = useState([]); // List of users, initially empty
    const [newUserName, setNewUserName] = useState('');
    const [loading, setLoading] = useState(true); // For loading animation

    useEffect(() => {
        loadUsers();
    }, []);

const loadUsers = async () => {
        try {
            setLoading(true); //Starts the loading animation
            const response = await fetchUsers();
            const data = Array.isArray(response.data) ? response.data : [];
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Stops the loading animation
        }
};
const handleCreateUser = async () => {
    if (!newUserName.trim()) {
        alert('Käyttäjän nimi ei voi olla tyhjä');
        return;
    }
    try {
        await createUser({ name: newUserName }); 
        setNewUserName(''); // clear the input field
        loadUsers(); // fetch the updated list of users
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

const handleSetActiveUser = async (userId) => {
    try {
        await updateUserStatus(userId);
        loadUsers(); // fetch the updated list of users
    } catch (error) {
        console.error('Error setting user active:', error);
    }
};
const handleDeleteUser = async (userId) => {
    try {
        await deleteUser(userId);
        loadUsers(); // fetch the updated list of users
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};


return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Käyttäjähallinta</h1>
        {/*show loading animation while fetching data */}
        {loading ? (
            <p>Ladataan...</p>
        ) : users.length === 0 ?(
            <p>Ei käyttäjiä</p>
        ) : (
            // Show the list of users
            <ul className="mb-4">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="border p-2 mb-2 rounded flex justify-between"
                    >
                        {user.name} {user.is_active && <span className="text-green-600">(Aktiivinen)</span>}
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleSetActiveUser(user.id)}
                        >
                            Aseta aktiiviseksi
                        </button>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleDeleteUser(user.id)}
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