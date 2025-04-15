import React, { useState } from 'react';
import styles from './Signup.module.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    const [firstName = '', lastName = ''] = form.fullName.trim().split(' ');

    try {
      const res = await fetch('http://localhost:3333/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          passwordRepeat: form.passwordRepeat,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
      } else {
        Cookies.set('token', data.access_token, { expires: 1 / 24 }); 
        setSuccess('Signup successful!');
        navigate('/signin')
        setForm({ firstName: '', lastName: '', email: '', password: '' });
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again. ' + err);
      console.log(err);
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.title}>
        <h2>Create account</h2>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
              <p>Full Name</p>
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <br />
            <p>Email</p>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <br />
            <p>Password</p>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <p>Re-enter Password</p>
            <input
              name="passwordRepeat"
              type="password"
              placeholder="Password Repeat"
              value={form.passwordRepeat}
              onChange={handleChange}
              required
            />
            <br />
            <button type="submit" className={styles.btt}>Create Account</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
          <div className={styles.BottomInfo}>
          <p>By creating an account, you agree to ProntoShop's Conditions of Use amd Privacy Notice</p>
          <hr />
          <p>Already have an account? <span onClick={() => navigate('/signin')}  style={{ color: '#81B214', cursor: 'pointer'}}> Sign in</span></p>
          </div>
      </div>
    </div>
  );
};
