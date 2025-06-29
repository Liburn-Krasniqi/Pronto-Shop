import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const withAuth = (WrappedComponent: React.ComponentType, role?: string) => {
  return (props: any) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading, userType } = useAuth();
    
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        if (role === 'vendor') {
          navigate('/vendor/signin');
        } else if (role === 'admin') {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      } else if (!loading && isAuthenticated && role && userType !== role) {
        // Only redirect if user type doesn't match required role
        if (userType === 'vendor') {
          navigate('/vendor/profile');
        } else if (userType === 'admin' && role !== 'admin') {
          navigate('/admin/dashboard');
        } else if (userType === 'user') {
          navigate('user/profile');
        }
      }
    }, [isAuthenticated, loading, role, userType, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;