import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import { X } from "lucide-react"
import { auth } from "../../firebase/firebase.config";
import { useAuth } from '../../context/AuthContext';
import { signupUser, getMe, getAllPitches, deletePitch  } from '../../api/api.js';


const Profile = () => {
    const { currentUser } = useAuth();
    const [pitches, setPitches] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [needsRole, setNeedsRole] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        if(!currentUser) {
            navigate("/login");
            return;
        }
        checkRole();

    }, [currentUser]);

    //check role from postgreSQL instead of firestore
    
        const checkRole = async() => {
            try {
                const data = await getMe();
                if(!data.user || !data.user.role){
                    setNeedsRole(true);
                }
                else {
                    setNeedsRole(false);
                    fetchPitches();
                }
            }
            catch {
                //user doesn't exist in postgresSQL
                setNeedsRole(true);
            }
            setLoading (false);

        };

    //Fetch pitches fomr PostgreSQL
    const fetchPitches = async () => {
        try {
            const data = await getAllPitches();
            //Filter pitches belonging to current user
            const myPitches = data.pitches.filter(
                pitch => pitch.firebase_uid === currentUser.uid
            );
            setPitches(myPitches);
        }
        catch (error){
            console.error('Error fetching the pitches: ', error)
        }
    };

    //Save role to PostgreSQL

    const handleRoleSelection = async (role) => {
        setRoleLoading(true);
        try {

            //Save role to postgreSQL via our API
            await signupUser ({
                firebase_uid: currentUser.uid,
                email: currentUser.email,
                name:  currentUser.displayName || '',
                role: role,
                createdAt: new Date(),
                photo_url: currentUser.photoURL || ''
            });
            navigate(role === "investor" ? "/investorDashboard" : "/founderDashboard");
        }
        catch(error) {
            console.error(("Error setting role: ", error));
        }
        finally{
            setRoleLoading(false);
        }
    };

    const handleDelete = async (id) => {
       try {
            await deletePitch(id);
            setPitches(pitches.filter(pitch => pitch.id != id));
       }
       catch (error) {
        console.error('Error deleting pitch: ', error);
       }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/login");
    };

    //still checking firestore for role, show loading spinner
    if(loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>;
    }

    //New user, no role yet, show role selection
    if(needsRole){
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50">
                <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-lg w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Who are you on FoundersDock?</h2>
                    <p className="text-gray-500 mb-8">Pick your role to get started</p>
                    <div className="flex gap-6 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRoleSelection('founder')}
                            disabled={roleLoading}
                            className="flex-1 border-2 border-blue-500 rounded-xl p-6 text-center hover:bg-blue-50 transition disabled:opacity-50"
                        >
                            <p className="text-3xl mb-2">🚀</p>
                            <p className="text-lg font-bold text-blue-600">Founder</p>
                            <p className="text-sm text-gray-500 mt-1">I have a startup idea to pitch</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRoleSelection('investor')}
                            disabled={roleLoading}
                            className="flex-1 border-2 border-green-600 rounded-xl p-6 text-center hover:bg-green-50 transition disabled:opacity-50"
                        >
                            <p className="text-3xl mb-2">💰</p>
                            <p className="text-lg font-bold text-green-600">Investor</p>
                            <p className="text-sm text-gray-500 mt-1">I want to fund great ideas</p>

                        </motion.button>
                    </div>
                </div>
            </div>
        )
    }
    //for existing users, show profile and pitches
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <motion.div
                animate={{x: menuOpen ? 0 : -300}}
                transition={{type: "spring", stiffness: 200}}
                className="w-64 bg-white border-r shadow-md p-6 fixed z-50 h-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                    <button onClick={() => setMenuOpen(false)}><X /></button>    
                </div>
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={currentUser?.photoURL || "https://via.placeholder.com/100"}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <p className="text-lg font-medium text-gray-700">{currentUser?.displayName || "Founder"}</p>    
                </div>
                <div className="mt-6 flex flex-col gap-3">
                    <button onClick={() => navigate("/saved")} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-left text-sm font-medium">
                        Saved Pitches
                    </button>
                    <button onClick={handleSignOut} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium ">
                        Sign Out
                    </button>    
                </div>    
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">Your Uploaded Pitches</h1>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {pitches.map((pitch) => (
                        <motion.div 
                            key={pitch.id}
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.4}}
                            className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{pitch.title}</h2>
                            {pitch.industry && (
                                 <p className="text-sm text-indigo-600 font-medium uppercase">{pitch.industry}</p>
                            )}
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{pitch.description}</p>
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => handleEdit(pitch.id)} className="text-sm px-4 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(pitch.id)} className="text-sm px-4 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600">
                                    Delete
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </div>
                {pitches.length === 0 && (
                    <p className="text-gray-400">You haven't posted any pitches yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;



