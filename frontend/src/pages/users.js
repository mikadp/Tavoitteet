import React, { useEffect, useState } from "react";
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState({});
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        fetchUsersFromDatabase();
    }, []);

const fetchUsersFromDatabase = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
};
const createUsers = async () => {
    try {
        await axios.post('http://localhost:8000/users', { name: newUserName });
        setNewUserName(''); // clear the input field
        fetchUsersFromDatabase(); // fetch the updated list of users
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

const setActiveUser = async (userId) => {
    try {
        await axios.patch(`http://localhost:8000/users/${userId}`);
        fetchUsersFromDatabase(); // fetch the updated list of users
    } catch (error) {
        console.error('Error setting user active:', error);
    }
};
const deleteUser = async (userId) => {
    try {
        await axios.delete(`http://localhost:8000/users/${userId}`);
        fetchUsersFromDatabase(); // fetch the updated list of users
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};


return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Käyttäjähallinta</h1>
        <u1 className="mb-4">
            {users.map(user => (
                <li key={user.id} className="border p-2 mb-2 rounded flex justify-between">
                    {user.name} {user.is_active && <span className="text-green-600">'(Aktiivinen)'</span>}
                    <button classname="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => setActiveUser(user.id)}>Aseta aktiiviseksi</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => deleteUser(user.id)}>Poista käyttäjä</button>
                    </li>
            ))}
        </u1>
    <div>
        <h2 className="text-xl font-bold mb-2">Luo uusi käyttäjä</h2>
        <input
            type="text"
            placeholder="Käyttäjän nimi"
            value={newUserName}
            onChange={(event) => setNewUserName(event.target.value)}
            classname="border p-2 mb-2 rounded"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={createUsers}>Lisää</button>
        </div>
    </div>
    );
};

export default Users;