import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if(loading) return <p className="text-center mt-10">Loading</p>;

    return currentUser ? children : <Navigate to ="/login" replace />;
};

export default ProtectedRoute;