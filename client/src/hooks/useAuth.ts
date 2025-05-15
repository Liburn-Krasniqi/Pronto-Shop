import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  sub: number;
  email: string;
  type: 'user' | 'vendor';
  exp: number;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<'user' | 'vendor' | null>(null);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch('http://localhost:3333/auth/refresh', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { access_token, refresh_token } = await response.json();
      Cookies.set('access_token', access_token);
      if (refresh_token) {
        Cookies.set('refresh_token', refresh_token);
      }

      const decoded: DecodedToken = jwtDecode(access_token);
      setUserType(decoded.type);

      return access_token;
    } catch (error) {
      // Clear tokens if refresh fails
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      throw error;
    }
  };

  const checkAuth = async () => {

    let storedToken = Cookies.get('access_token') ?? null;
    
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      // First try with current token
     
      const decoded: DecodedToken = jwtDecode(storedToken);
      const endpoint = decoded.type === 'user' ? 'users/me' : 'vendor/me';
      setUserType(decoded.type);
      
      let response = await fetch(`http://localhost:3333/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },

      });
      

      // If token expired, try to refresh
      if (response.status === 401) {
        storedToken = await refreshAccessToken();

        if (!storedToken) throw new Error("No token to decode");
        const decodedRefresh: DecodedToken = jwtDecode(storedToken);

        const refreshedEndpoint = decodedRefresh.type === 'user' ? 'users/me' : 'vendor/me';
        setUserType(decodedRefresh.type);

        response = await fetch(`http://localhost:3333/${refreshedEndpoint}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setToken(storedToken);
        setIsAuthenticated(true);
        setUserData(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setToken(null);
    setIsAuthenticated(false);
    setUserData(null);
    setUserType(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { 
    token, 
    isAuthenticated, 
    loading, 
    error, 
    userData,
    userType,
    setToken,
    setIsAuthenticated,
    refreshAccessToken,
    logout
  };
};