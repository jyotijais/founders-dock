import {useParams, useNavigate } from 'react-router-dom';
import {useEffect, useState } from 'react';
import SubmitPitchForm from '../components/SubmitPitchForm';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../firebase/firebase.config.js';
import {getPitchById} from '../firebase/getPitch.js';

export default function EditPitch() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [pitchData, setPitchData] = useState(null);

    useEffect( () => {
        const fetchPitch = async() => {
            const docRef = doc(db, "pitches", id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setPitchData({id: docSnap.id , ...docSnap.data()});
            }
        };
        fetchPitch();
    },[id]);

    const handleUpdate = async(updatedData) => {
        const docRef = doc(db, "pitches", id);
        await updateDoc(docRef, updatedData);
        navigate("/profile");
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Your Pitch</h1>
            {pitchData ? (
                <SubmitPitchForm initialData={pitchData} onSubmit={handleUpdate} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};1