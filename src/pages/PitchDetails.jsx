import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase.config.js';
import { doc, getDoc } from 'firebase/firestore';

const PitchDetails = () => {
    const { id } = useParams();
    const [pitch, setPitch] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPitch = async () => {
            try {
                const pitchRef = doc(db, 'pitches', id);
                const pitchSnap = await getDoc(pitchRef);

                if (pitchSnap.exists()) {
                    setPitch(pitchSnap.data());
                } else {
                    setError('Pitch not found');
                }
            } catch (error) {
                console.log("Error fetching pitch: ", error);
                setError('Failed to load pitch details. Please try again later.');
            }
        };
        fetchPitch();
    }, [id]);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!pitch) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">{pitch.startupName}</h2>
            <p className="text-gray-700 mb-2"><strong>Founder:</strong> {pitch.founderName}</p>
            <p className="text-gray-600 mb-6">{pitch.description}</p>

            {pitch.website && (
                <a href={pitch.website} className="block text-blue-600 hover:underline mb-2" target="_blank" rel="noopener noreferrer">
                    Visit Website
                </a>
            )}
            {pitch.linkedin && (
                <a href={pitch.linkedin} className="block text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {pitch.tags && pitch.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">#{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default PitchDetails;
