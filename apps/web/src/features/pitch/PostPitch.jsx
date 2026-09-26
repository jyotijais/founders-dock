import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPitch, getMe } from '../../api/api.js';
import { auth } from '../../firebase/firebase.config.js';

const PostPitch = () => {
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
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);
    const [Authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            const currentUser = auth.currentUser;
            if(!currentUser){
                navigate('/login');
                return;
            }
            
            try {
                const{ user } = await getMe();
                if(!user || user.role !== 'founder'){
                    navigate('/investorDashboard');
                    return;
                }
                setAuthorized(true);
            } catch (error){
                console.error('Role check failed: ', error);
                navigate('/login');

            } finally{
                setCheckingRole(false);
            }
        }
        checkRole();
    },[navigate])

    if (checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checking access...</p>
            </div>
        );
    }

    if (!Authorized) {
        return null;
    }
    


    const handleChange = (e) => {
        setFormData(({ ...formData, [e.target.name]: e.target.value }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        //debug check
        console.log('Current user:', auth.currentUser);
        console.log('Token:', await auth.currentUser?.getIdToken());

        // validate Linkedin URL
        let linkedin = formData.linkedin.trim();
        if(linkedin){
            if(!linkedin.startsWith('http')) {
            linkedin = 'https://'+ linkedin;
        }
        const isValidLinkedin = /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/i.test(linkedin);
            if(!isValidLinkedin){
                setLoading(false);
                return setError('Please enter a valid LinkedIn URL');
            }
        }
        
        
        // validate website URL
        let website = formData.website.trim();
        if(website && !website.startsWith('https://')){
            website = 'https://'+ website;
        }

        try {
            await createPitch({
                title: formData.title,
                description: formData.description,
                industry: formData.industry,
                stage: formData.stage,
                funding_goal: formData.funding_goal,
                location: formData.location,
                team_size: formData.team_size ? parseInt(formData.team_size) : null,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                website: website || null,
                linkedin: linkedin || null,
            });
            navigate('/founderDashboard'); //redirects to founders dashboard after a successfull post
        } catch (error) {
            console.error("Error posting pitch: ", error);
            setError("Failed to post pitch. Please try again.");
        } finally {
            setLoading(false);
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
                            placeholder="Funding Goal (e.g. 500k)"
                            value={formData.funding_goal}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                        />
                      

                        <input
                            name="location"
                            placeholder="Location (e.g. New York, USA)"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                        />

                        <input
                            name="team_size"
                            placeholder="Team Size (e.g. 3)"
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
                            placeholder="Website URL"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                        />
                        
                        
                        <input
                            name="linkedin"
                            placeholder="LinkedIn Profile URL"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded border"
                        />

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition mt-5">
                            {loading ? 'Posting...' : 'Submit Pitch'}
                        </button>
                </form>
            </div>
        </div>
    );
};

export default PostPitch;