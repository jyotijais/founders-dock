import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './features/auth/Signup';
import Login from './features/auth/Login';
import EditPitch from './features/pitch/EditPitch';
import PostPitch from './features/pitch/PostPitch';
import PitchDetails from './features/pitch/PitchDetails';
import SavedPitches from './features/pitch/SavedPitches';
import InvestorDashboard from './features/dashboard/InvestorDashboard';
import FounderDashboard from './features/dashboard/FounderDashboard';
import Profile from './features/user/Profile';
import Explore from './pages/Explore';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';






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
        <Route path="/saved" element={<ProtectedRoute><SavedPitches /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPitch /></ProtectedRoute>} />
        <Route path="/investorDashboard" element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>}/>
        <Route path="/founderDashboard" element={<ProtectedRoute><FounderDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;