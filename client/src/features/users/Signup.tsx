import React, { useState } from 'react';
import styles from './Signup.module.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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

    try {
      const res = await fetch('http://localhost:3333/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
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
            <div className={styles.nameContainer}>
              <div>
                <p>First Name</p>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
              <div>
                <p>Last Name</p>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <br />
            </div>
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
            <br />
            <button type="submit" className={styles.btt}>Create Account</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      </div>
    </div>
  );
};
