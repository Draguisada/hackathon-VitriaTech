import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const postoId = localStorage.getItem('id_posto');
    
    if (!token || !postoId) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}
