import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PostPitch from './pages/PostPitch';
import Explore from './pages/Explore';
import ProtectedRoute from './components/ProtectedRoute';
import PitchDetails from './pages/PitchDetails';
import SavedPitches from './pages/SavedPitches';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import EditPitch from './pages/EditPitch';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} /> 
        <Route path="/post" element={
          <ProtectedRoute>
            <PostPitch />
          </ProtectedRoute>
        } />
        <Route path="/pitch/:id" element={<PitchDetails />} />
        <Route path="/saved" element={<SavedPitches />} />
        <Route path="/explore/profile" element={<Profile />} />
        <Route path="/edit" element={<EditPitch />} />
      </Routes>
    </Router>
  );
}

export default App;