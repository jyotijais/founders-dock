import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA48AJ3oIDe7i-jeTnx009KTFhppoak-Fg",
  authDomain: "foundersdock.firebaseapp.com",
  projectId: "foundersdock",
  storageBucket: "foundersdock.firebasestorage.app",
  messagingSenderId: "1059479300624",
  appId: "1:1059479300624:web:489d03f46205a761493895",
  measurementId: "G-FENRF4Q56J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth , db};