import {doc, getDoc } from 'firebase/firestore';
import {db} from './firebase.config.js';

export async function getPitchById(id) {
    const docRef = doc(db, "pitches", id);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
        return {id: docSnap.id, ...docSnap.data()};
    } else {
        throw new Error("Pitch not found");
    }
}