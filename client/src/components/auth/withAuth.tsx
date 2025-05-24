import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const withAuth = (WrappedComponent: React.ComponentType, role?: string) => {
  return (props: any) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();
    
    
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        if(role === 'vendor') navigate('/vendor/signin');
        else navigate('/login');
      }
    }, [isAuthenticated, loading, role, navigate]);

    if (loading) return <div>Loading...</div>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;