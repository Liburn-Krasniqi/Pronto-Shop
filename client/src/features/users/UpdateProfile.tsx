import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import Cookies from 'js-cookie';

interface EditProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  CurrentPassword: string;
  NewPassword?: string;
}

export const EditProfilePage: React.FC = () => {
  const [form, setForm] = useState<EditProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    CurrentPassword: '',
    NewPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      fetch('http://localhost:3333/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setForm({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            CurrentPassword: '',
            NewPassword: '',
          });
        })
        .catch((err) => {
          setError('Error fetching user data');
          console.error(err);
        });
    }
  }, []);

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
      const res = await fetch('http://localhost:3333/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Profile update failed');
      } else {
        setSuccess('Profile updated successfully!');
        setUser(data);
        navigate('/profilePage');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Current Password</label>
            <input
              name="CurrentPassword"
              type="password"
              placeholder="Enter your current password"
              value={form.CurrentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Password (optional)</label>
            <input
              name="NewPassword"
              type="password"
              placeholder="Enter new password (if changing)"
              value={form.NewPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
      </div>
    </div>
  );
};
