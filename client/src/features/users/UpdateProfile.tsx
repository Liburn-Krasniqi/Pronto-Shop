import React, { useState, useEffect } from 'react';
import styles from './Signup.module.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
}

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<EditProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3333/users/me', {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setForm(prev => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }));
      })
      .catch(err => {
        setError('Failed to fetch user data.');
        console.error(err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:3333/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Update failed');
      } else {
        setSuccess('Profile updated successfully!');
        navigate('/profilePage');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.title}>
        <h2>Edit Profile</h2>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <label>Last Name</label>
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label>Current Password</label>
            <input
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
            <label>New Password</label>
            <input
              name="newPassword"
              type="password"
              placeholder="Enter new password (optional)"
              value={form.newPassword}
              onChange={handleChange}
            />
            <br />
            <button type="submit" className={styles.btt}>Save Changes</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      </div>
    </div>
  );
};
