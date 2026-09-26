import { useState } from 'react';

export default function SubmitPitchForm({ initialData, editMode = false, pitchId, onSubmit }) {
    const [startupName, setStartupName] = useState(initialData.startupName || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [website, setWebsite] = useState(initialData.website || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({startupName, description, website, pitchId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text"
                placeholder="Startup Name"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <textarea 
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="url"
                placeholder="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editMode ? "Update Pitch" : "Submit Pitch"}
            </button>
        </form>
    )
}