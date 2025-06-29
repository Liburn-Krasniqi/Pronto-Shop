import Cookies from 'js-cookie';

export const login = async (email: string, password: string, type: 'user' | 'vendor' | 'admin') => {
  const response = await fetch('http://localhost:3333/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      type,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  Cookies.set('access_token', data.access_token, { 
    expires: 1 / 24, // 1 hour
    sameSite: 'strict',
    secure: true
  });
  if (data.refresh_token) {
    Cookies.set('refresh_token', data.refresh_token, {
      sameSite: 'strict',
      secure: true
    });
  }
  return data;
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  window.location.href = '/';
};