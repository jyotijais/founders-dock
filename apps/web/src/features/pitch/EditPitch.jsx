import {useParams, useNavigate } from 'react-router-dom';
import {useEffect, useState } from 'react';
import {getPitchById, updatePitch} from '../../api/api.js';

export default function EditPitch() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [pitchData, setPitchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        industry: '',
        stage: '',
        funding_goal: '',
        location: '',
        team_size: '',
        website: '',
        linkedin: '',
        tags: '',

    });

    useEffect( () => {
        const fetchPitch = async() => {
            try {
                const data = await getPitchById(id);
                setPitchData(data);
                setFormData({
                title: data.pitch.title || '',
                descriotion: data.pitch.description || '',
                industry: data.pitch.industry || '',
                stage: data.pitch.stage || '',
                funding_goal: data.pitch.funding_goal || '',
                location: data.pitch.location || '',
                team_size: data.pitch.teamsize || '',
                website: data.pitch.website || '',
                linkedin: data.pitch.linkedin || '',
                tags: data.pitch.tags?.join(', ') || '',

            });
            } catch (error) {
                setError('Failed to load pitch');
                console.log('Error fetching pitch details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPitch();
    },[id]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async(e) => {
        e.preventDefault();
        try {
            updatePitch(id, {
                title: formData.title,
                description: formData.description,
                industry: formData.industry,
                stage: formData.stage,
                funding_goal: formData.funding_goal,
                location: formData.location,
                team_size: formData.team_size? parseInt(formData.team_size) : null,
                website: formData.website || null,
                linkedin: formData.linkedin || null,
                tags: formData.tags.split(', ').map(tag => tag.trim()).filter(tag => tag),
            });
            navigate('/profile');
        } catch (error) {
            setError('Failed to update pitch');
            console.log('Error updating pitch: ', error);
        }
    };

    if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
    if(error) return <p className="text-center mt-10 text-red-500">{error}</p>

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
                    Edit Your Pitch
                </h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleUpdate} className="bg-blue-50 p-8 rounded-lg shadow-md">
                    <input
                        name="title"
                        placeholder="Startup Name"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Pitch Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border min-h-[120px]"
                        required
                    />
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border bg-white"
                        required
                    >
                        <option value="">Select Industry</option>
                        <option value="EdTech">EdTech</option>
                        <option value="AI">AI</option>
                        <option value="SaaS">SaaS</option>
                        <option value="HealthTech">HealthTech</option>
                        <option value="FinTech">FinTech</option>
                        <option value="CleanTech">CleanTech</option>
                        <option value="E-commerce">E-commerce</option>
                    </select>
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border bg-white"
                        required
                    >
                        <option value="">Select Stage</option>
                        <option value="Pre-Seed">Pre-Seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                    </select>
                    <input
                        name="funding_goal"
                        placeholder="Funding Goal (e.g. 500K)"
                        value={formData.funding_goal}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <input
                        name="location"
                        placeholder="Location (e.g. Bangalore, India)"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <input
                        name="team_size"
                        placeholder="Team Size (e.g. 3)"
                        type="number"
                        value={formData.team_size}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <input
                        name="tags"
                        placeholder="Tags (comma separated e.g. AI, SaaS, B2B)"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <input
                        name="website"
                        placeholder="Website URL (optional)"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <input
                        name="linkedin"
                        placeholder="LinkedIn URL (optional)"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 rounded border"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition mt-2"
                    >
                        Update Pitch
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}