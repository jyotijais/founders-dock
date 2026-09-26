import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase.config.js';
import { useAuth } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SavedPitches = () => {
    const { currentUser } = useAuth();
    const [savedPitches, setSavedPitches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async() => {
            if(!currentUser) return ;
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            const savedIds = userSnap.data()?.savedPitches || [];
            const allPitchesSnap = await getDocs(collection(db, 'pitches'));

            const saved = allPitchesSnap.docs
            .filter(doc => savedIds.includes(doc.id))
            .map(doc => ({id: doc.id, ...doc.data() }));

            setSavedPitches(saved);
            setLoading(false);
        };

        fetchSaved();
    },[currentUser]);

    if(loading) return <p className="text-center py-10 text-gray-500">loading Saved Pitches</p>;
    return (
        <div>
            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                Your Saved Pitches
            </h1>
            {savedPitches.length === 0 ? (
                <p className="text-center text-gray-500">No saved pitches found.</p>
            ) : (
                <div className="space-y-6">
                    {savedPitches.map(pitch => (
                        <div key={pitch.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">{pitch.startupName}</h2>
                            <p className="text-gray-700 mb-4">{pitch.founderName}</p>
                            <p className="text-gray-600 mb-4">{pitch.description.slice(0, 120)}...</p>
                            <Link to={`/pitch/${pitch.id}`} className="text-blue-600 hover:underline text-sm">View Details</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};
export default SavedPitches;