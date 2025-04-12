import React, { useState } from 'react';
import styles from './Signup.module.css';


interface SigninFormData {
  email: string;
  password: string;
}

export const SigninPage: React.FC = () => {
  const [form, setForm] = useState<SigninFormData>({
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
        // Save token or user info
        localStorage.setItem('access_token', data.access_token);
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again. ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className = {styles.Container}>
      <div className = {styles.title}>
        <h2>Sign In</h2>
        <div className = {styles.formContainer}>
          <form onSubmit={handleSubmit}>
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
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <br />
            <button type="submit"  className={styles.btt}>Sign In</button>
          </form>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
};

// export default SigninPage;
