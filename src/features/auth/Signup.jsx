import {useState} from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase.config.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signupUser } from '../../api/api.js'
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            //Then save user to postgreSQL via our API
            await signupUser({
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || email.split('@')[0],
                role: null,
                photo_url: user.photoURL || ''
            });

            navigate('/profile');
        }catch(error) {
            setError(error.message);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            //check if user profile is already created in firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if(!userSnap.exists()){
                //new user. create a user profile in firestore
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName,
                    createdAt: new Date(),
                });

                //also save to postgreSQL via our API
                await signupUser ({
                    firebase_uid: user.uid,
                    email: user.email,
                    name: user.displayName || '',
                    role: null,
                    photo_url: user.photoURL || ''
                })
                navigate('/profile'); //let me pick founder or investor role
            }
            else {
                const role = userSnap.data().role;
                navigate(role === 'investor' ? '/investorDashboard' : '/founderDashboard');
            }

        }
        catch(error) {
            setError("Google signup failed. Please try again.");
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Account</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Sign Up</button>

                <div className="flex items-center my-4" >
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 text-gray-400 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full border border-gray-300 py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                    Continue with Google
                </button>
                <p>
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>

            </form>
        </div>
    );
};

export default Signup;