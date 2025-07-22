import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebase.config.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home after successful login
        }catch(error) {
            setError("invalid email or password");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login to FoundersDock</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    
                />
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
    };
export default Login;