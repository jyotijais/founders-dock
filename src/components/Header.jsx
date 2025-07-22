import { Link } from 'react-router-dom';

const Header = () => {
    return (
         <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">FoundersDock</h1>
                <nav className="flex space-x-8 items-center ">
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition">Explore</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition">Post Startup</a>
                    <Link to="/login">
                        <button className="ml-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="ml-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow">
                            Sign Up 
                        </button>
                    </Link>
                    
                    <Link to="/explore">
                        <button className="ml-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow">
                            Explore 
                        </button>
                    </Link>
                </nav>
            </div>
         </header>
    );
};

export default Header;