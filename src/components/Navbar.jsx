import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl w-full px-4b py-3 flex justify-between items-center ">
                <Link to="/" className="text-xl font-bold text-blue-700">
                    FoundersDock 🚀
                </Link>
                <div className="flex gap-2 items-center text-md font-medium text-gray-700">
                    <Link to="/explore" className="hover:text-blue-600">Explore</Link>
                    <Link to="/post" className="hover:text-blue-600">Post</Link>
                    <Link to="/saved" className="hover:text-blue-600">Saved</Link>
                    {currentUser ? (
                        <span className="text-green-600">Hi, {currentUser.displayName || "Founder"}</span>
                    ): (
                        <Link to="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>

        </nav>
    );
};
export default Navbar;