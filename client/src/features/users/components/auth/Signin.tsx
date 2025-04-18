import React, { useState } from 'react';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


interface SigninFormData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:3333/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sign in failed');
      } else {
        setSuccess('Signed in!');
        Cookies.set('access_token', data.access_token);
        navigate('/profilePage')

        const profileRes = await fetch('http://localhost:3333/users/me', {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const profile = await profileRes.json();

        if (profileRes.ok) {
          setUser(profile);
        } else {
          setError('Could not fetch user info');
        }
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again. ' + err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.logo}>
        <img alt="Pronto Logo" src="/letter-p.svg" />
      </div>
      <div className={styles.Container}>
        <div className={styles.title}>
          <h2>Sign In</h2>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <br />
              <button type="submit" className={styles.btt}>Sign In</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          
            <div className={styles.BottomInfo}>
            <hr />
            <p>Don't have an account? <span onClick={() => navigate('/signup')}  style={{ color: '#81B214', cursor: 'pointer'}}> Sign up</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
