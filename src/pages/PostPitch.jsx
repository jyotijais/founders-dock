import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase.config.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PostPitch = () => {
    const [formData, setFormData] = useState({
      founderName: '',
      startupName: '',
      website: '',
      linkedin: '',
      description: '',
      tags: '',  
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(({ ...formData, [e.target.name]: e.target.value }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(!user) return setError('You must be logged in to post a pitch');

        // validate Linkedin URL
        let linkedin = formData.linkedin.trim();
        if(!linkedin.startsWith('http')) {
            linkedin = 'https://'+ linkedin;
        }
        const isValidLinkedin = /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/i.test(linkedin);
        if(!isValidLinkedin){
            return setError('Please enter a valid LinkedIn URL');

        }
        // validate website URL
        let website = formData.website.trim();
        if(website && !website.startsWith('https://')){
            website = 'https://'+ website;
        }

        try {
            await addDoc(collection(db, "pitches"), {
                ...formData,
                linkedin,
                tags: formData.tags.split(',').map(tag=> tag.trim()),
                uid: user.uid,
                createdAt: serverTimestamp(),
            });
            navigate('/'); // redirect to home after successful post
        } catch (error) {
            console.error("Error posting pitch: ", error);
            setError("Failed to post pitch. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
                    Post Your Startup Pitch
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="bg-blue-50 p-8 rounded-lg shadow-md">
                        {/* Input fields for pitch details */}
                        <input
                            name="founderName"
                            placeholder="Founder Name"
                            value={formData.founderName}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                            required
                        />
                        <input
                            name="startupName"
                            placeholder="Startup Name"
                            value={formData.startupName}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                            required
                        />
                        <input
                            name="website"
                            placeholder="Website URL"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                            required
                        />
                        <input
                            name="linkedin"
                            placeholder="LinkedIn Profile URL"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                            required
                        />
                        <input
                            name="tags"
                            placeholder="Tags (comma separated)"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                            required
                        />
                    
                    <textarea
                        name="description"
                        placeholder="Pitch Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 mb-6 rounded border min-h-[120px]"
                    ></textarea>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
                        Submit Pitch
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostPitch;