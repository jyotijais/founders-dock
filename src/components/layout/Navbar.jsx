import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config.js';
import { useState, useEffect } from 'react';
import { getMe } from '../../api/api.js';


const Navbar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            if(currentUser) {
                try {
                    const data = await getMe();
                    setRole(data.user?.role);
                } catch (error) {
                    console.error('Error fetching role:', error);
                }
            }
        };
        fetchRole();

    },[currentUser]);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl w-full px-4 py-3 flex justify-between items-center ">
                <Link to="/" className="text-xl font-bold text-blue-700">
                    FoundersDock 🚀
                </Link>
                <div className="flex gap-4 items-center text-md font-medium text-gray-700">
                    <Link to="/explore" className="hover:text-blue-600">Explore</Link>

                    {/* Show the Post link only for f ounders */}
                    {currentUser && role === 'founder' && (
                        <Link to="/post" className="hover:text-blue-600">Post</Link>
                    )}

                    {/* show saved only pitchs to investors */}
                    {currentUser && role === 'investor' && (
                        <Link to="/saved" className="hover:text-blue-600">Saved</Link>
                    )}

                    {currentUser ? (
                        <div className = "relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Hi, {currentUser.displayName || currentUser.email?.split('@')[0]} ▼
                                
                            </button>

                            {/* Dropdown menu */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                                    <Link
                                        to="/profile"
                                        onClick={() => { setMenuOpen(false)}}
                                        className="block px-4 py-2 text-gray-700 hover: bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    {role === 'founder' && (
                                        <Link
                                            to="/founderDashboard"
                                            onClick={() => { setMenuOpen(false)}}
                                            className="block px-4 py-2 text-gray-700  hover:bg-gray-50"
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    {(role === 'investor') && (
                                        <Link
                                            to="/investorDashboard"
                                            onClick={() => { setMenuOpen(false)}}
                                            className=" block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { handleSignOut(); setMenuOpen(false)}}
                                        className="w-full text-left px-4 py-4 text-red-600 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>

                                </div>
                            )}
                        </div>
                    ): (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

        </nav>
    );
};
export default Navbar;