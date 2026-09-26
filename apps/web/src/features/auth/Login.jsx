import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase/firebase.config.js';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { getMe } from '../../api/api.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //Read role from postgreSQL instead of firebase
    const redirectByRole = async () => {
        try {
            const data = await getMe();
            if(!data.user || !data.user.role) {
                navigate('/profile');
            }
            else {
                navigate(data.user.role === 'investor' ? '/investorDashboard' : '/founderDashboard');
            }
        }
        catch (error) {
            navigate('/profile')
        }
    }

    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try{
            await signInWithEmailAndPassword(auth, email, password);
            await redirectByRole();
        }catch(error) {
            setError("invalid email or password");
        }finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            await redirectByRole();
        }
        catch(error) {
            setError("Google login failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    const handleForgotPassword = async () => {
        setError('');
        setSuccess('');
        if(!email) {
            setError("Please emter your email to reset password");
            return;
        }
        try{
            await sendPasswordResetEmail(auth, email);
            setSuccess("Password reset email sent! Check your inbox.");
        }
        catch(error) {
            setError("Failed to send password reset email. Please check you email address and try again.");
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login to FoundersDock</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required  
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                >

                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>

                <div className="flex justify-center mb-4">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-indigo-600 hover:underline">
                        Forgot Password?
                    </button>

                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 text-gray-400 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full border border-gray-300 py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm mt-4">
                    Don't have an account? {" "}
                    <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
                </p>
            </form>
        </div>
    );
    };
export default Login;