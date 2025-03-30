import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className='text-center'>
            <h1 className='text-4x1 font-bold mb-4'>Etusivu</h1>
            {user ? (
                <p className='text-lg'>Tervetuloa tavoitteiden seuranta appiin {user.name}!</p>
            ) : (
                <div>
                    <p className="text-lg">Kirjaudu sisään oheisen linkin kautta</p>
                    <Link
                        to="/login"
                        className="text-blue-500 hover:underline"
                        > Kirjaudu
                        </Link>
                </div>
            )}
        </div>
    );
};

export default Home;