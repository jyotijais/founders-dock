import { useAuth } from '../context/AuthContext';
import { useEffect , useState } from 'react';
import { db } from '../firebase/firebase.config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { currentUser } = useAuth();
    const [ myPitches, setMyPitches ] = useState([]);
    const [ savedPitches, setSavedPitches ] = useState([]);

    useEffect (() => {
        const fetchData = async() => {
            const q = query(collection(db, "pitches"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const pitches = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
            setMyPitches(pitches);
        };

        const fetchSaved = async () => {
            const savedRef = collection(db, "users", currentUser.uid, "saved");
            const querySnapshot = await getDocs(savedRef);
            const saved = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data}));
            setSavedPitches(saved);
        };

        if(currentUser) {
            fetchData();
            fetchSaved();
        }
    }, [currentUser]);

    return (
        
        <motion.div 
            className="p-6 max-w-4xl mx-auto"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
        >
            <h1 className="text-3xl font-bold mb-6">
                Welcome, {currentUser?.displayName || "Founder"}!
            </h1>

            <motion.section
                className="mb-6"
                initial={{x: -30, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{delay: 0.2}}
            >
                <h2 className="tet-xl font-semibold mb-2">Your Submitted Pitches</h2>
                {myPitches.length === 0 ? (<p>No pitches submitted.</p> ): (
                    <ul className="list-disc ml-6">
                        {myPitches.map(p => <li key={p.id} className="flex justify-between items-center">{p.startupName}
                            <Link to={`/edit/${p.id}`} className="text-sm text-blue-600 hover:underline">
                                Edit
                            </Link>
                        </li>)}
                    </ul>
                )}
            </motion.section>

            <motion.section
                initial={{x: 30, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{delay: 0.4}}
            >
                <h2 className="text-xl font-semibold mb-2">Saved Pitches</h2>
                {savedPitches.length === 0 ? (<p>No saved pitches yet.</p>) : (
                    <ul classname="list-disc ml-6">
                        {savedPitches.map((p) => (<li key={p.id}>{startupName}</li>))}
                    </ul>
                )}
            </motion.section>
            
        </motion.div>
    );
}
