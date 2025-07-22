import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.config.js';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ContactModal from './ContactModal.jsx';;

const Explore = () => {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const [showSavedToast, setShowSavedToast ] = useState(false);
    const [selectedPitch, setSelectedPitch] = useState(null);

    useEffect(() => {
        const fetchPitches = async () => {
            try {
                const pitchesCollection = collection(db, 'pitches');
                const q = query(pitchesCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const pitchesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPitches(pitchesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching pitches: ", error);
                setError("Failed to load pitches. Please try again later.");
                setLoading(false);
            }
        };

        fetchPitches(); // Call it here
    }, []);

    if (loading) {
        return <p className="text-center py-10 text-gray-600">Loading pitches...</p>;
    }

    const toggleSave = async (pitchId) => {
        if(!currentUser) return alert('You must be logged in to save pitches');

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){
            await setDoc(userRef, {savedPitches: [pitchId] });
        }
        else{
            const saved = userSnap.data().savedPitches || [];
            if(saved.includes(pitchId)){
                await updateDoc(userRef, {
                    savedPitches: arrayRemove(pitchId)
                })
            }
            else {
                await updateDoc(userRef, {
                    savedPitches: arrayUnion(pitchId)
                })
            }
    
        }
    };

    const handleSavedPitch = async (pitchId) => {
        try {
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 2000);
        } catch (error) {
            console.error("Failed to save the pitch: ", error);
            
        }
    };

    
    return (
   
    <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Explore Startup Ideas</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {showSavedToast && (
            <div className="fixed top-20 right-5 transform bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
            Pitch saved!
            </div>
        )}

         
        {selectedPitch && (
        <ContactModal pitch={selectedPitch} onClose={() => setSelectedPitch(null)} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {pitches.map(pitch => (
                <div key={pitch.id} className=" relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow  ">

                    <div className="flex justify-end mb-2">
                        <button
                        onClick = {async () => {
                        await toggleSave(pitch.id); 
                        handleSavedPitch(pitch.id) 
                        }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                        >
                        Save
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{pitch.startupName}</h2>
                    <p className="text-gray-600 mb-4">{pitch.founderName}</p>
                    <p className="text-gray-500 mb-4">{pitch.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {pitch.tags && pitch.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">{tag}</span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-sm mb-3">
                        <a href={pitch.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                        </a>
                        <a href={pitch.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            LinkedIn
                        </a>
                        <span className="text-gray-500 text-sm">
                            {pitch.createdAt ? new Date(pitch.createdAt.toDate()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                day: 'numeric',
                                month: 'short',
                            }) : ''}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                    <Link to ={`/pitch/${pitch.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">View Details</Link>
                    <button
                        onClick={() => setSelectedPitch(pitch)}
                        className="mt-4 text-blue-600 hover:underline text-sm"
                    >
                        Contact Founder
                    </button>
                    </div>
                        
                </div>
            ))}
        </div>
            
    </div>       
       
    );
};

export default Explore;
