import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white-600 text-white p-4">
            <ul className="flex space-x-4 justify-center">
                <li>
                    <Link to="/" className="text-black hover:text-gray-300 font-medium">Etusivu</Link>
                </li>
                <li>
                    <Link to="/Goals" className="text-black hover:text-gray-300 font-medium">Tavoitteet</Link>
                </li>
                <li>
                    <Link to="/Users" className="text-black hover:text-gray-500 font-medium">Käyttäjät</Link>
                </li>
                <li>
                    <Link to="/Calendar" className="text-black hover:text-gray-300 font-medium">Kalenteri</Link>
                </li>
                <li>
                    <Link to="/Dashboard" className="text-black hover:text-gray-300 font-medium">Hallintapaneeli</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
