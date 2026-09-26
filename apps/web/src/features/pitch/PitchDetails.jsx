import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPitchById } from '../../api/api.js';


const PitchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pitch, setPitch] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPitch = async () => {
            try {
                const data = await getPitchById(id);
                setPitch(data.pitch);
            } catch (error) {
                console.error("Error fetching pitch: ", error);
                setError('Pitch not found');
            }
            finally {
                setLoading(false);
            }
        };
        fetchPitch();
    }, [id]);

    if(loading) return <p className="text-center text-gray-600 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!pitch) return <p className="text-center text-gray-600">Pitch not found</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-6 block">
                ← Back
            </button>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">{pitch.title}</h2>
            
            <div className="flex gap-3 mb-4">
                {pitch.industry && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full  text-sm">
                        {pitch.industry}
                    </span>
                )}
                {pitch.stage && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm ">
                        {pitch.stage}
                    </span>
                )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{pitch.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{pitch.location || 'Remote'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Funding Goal</p>
                    <p className="font-medium">{pitch.funding_goal || 'Undisclosed'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="font-medium">{pitch.team_size? `${pitch.team_size} members` : 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Stage</p>
                    <p className="font-medium">{pitch.stage || 'N/A'}</p>
                </div>

            </div>

            {pitch.tags && pitch.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {pitch.tags.map((tag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

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

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium mt-6">
                Contact Founder
            </button>
        </div>
    );
};

export default PitchDetails;
