import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

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
      let response = await fetch('http://localhost:3333/users/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // If token expired, try to refresh
      if (response.status === 401) {
        storedToken = await refreshAccessToken();
        response = await fetch('http://localhost:3333/users/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
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

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setToken(null);
    setIsAuthenticated(false);
    setUserData(null);
  };

  return { 
    token, 
    isAuthenticated, 
    loading, 
    error, 
    userData,
    setToken,
    setIsAuthenticated,
    refreshAccessToken,
    logout
  };
};