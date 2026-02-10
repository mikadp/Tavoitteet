import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>Etusivu</h1>
            {user ? (
                <><p className='text-lg'>Tervetuloa tavoitteiden seuranta appiin {user.username}!</p>
                    <button
                        className="bg-blue-500 text-white p-2 rounded mt-4"
                        onClick={() => { localStorage.removeItem('token'); window.location.reload(); } }
                    >Kirjaudu ulos
                    </button></>
            ) : (
                <div>
                    <p className="text-lg">Kirjaudu sisään tai rekisteröidy</p>
                    <Link
                        to="/login"
                        className="text-blue-500 hover:underline"
                        > Kirjaudu
                    </Link>
                    <Link
                        to="/register"
                        className="text-blue-500 hover:underline ml-4"
                        > Rekisteröidy
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;