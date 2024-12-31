import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white-600 text-white p-4">
            <ul className="flex space-x-4 justify-center">
                <li>
                    <Link to="/" className="hover:underline">Etusivu</Link>
                </li>
                <li>
                    <Link to="/goals" className="hover:underline">Tavoitteet</Link>
                </li>
                <li>
                    <Link to="/users" className="hover:underline">Käyttäjät</Link>
                </li>
                <li>
                    <Link to="/calendar" className="hover:underline">Kalenteri</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
