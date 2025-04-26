import Cookies from 'js-cookie';

export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3333/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  Cookies.set('access_token', data.access_token);
  Cookies.set('refresh_token', data.refresh_token);
  return data;
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  window.location.href = '/login';
};