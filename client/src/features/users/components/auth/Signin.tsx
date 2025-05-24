import React, { useState } from 'react';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../utils/auth';
import { useAuth } from '../../../../hooks/useAuth';


interface SigninFormData {
  email: string;
  password: string;
  type: 'user' | 'vendor';
}


export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
    const { isAuthenticated, loading, userType } = useAuth();

    if(isAuthenticated && userType === 'user') navigate('/profilePage');
    if(isAuthenticated && userType === 'vendor') navigate('/vendor/show');
  
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
    type: 'user',
  });

  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);


 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // setLoading(true);

    try {
      // Use the centralized login function
      await login(form.email, form.password, form.type);
      // Redirect to profile page after successful login
      window.location.href = '/profilePage';
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      // setLoading(false);
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
              <button type="submit" disabled={loading} className={styles.btt}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* {success && <p style={{ color: 'green' }}>{success}</p>} */}
          
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
