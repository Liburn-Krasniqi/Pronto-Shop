import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import Cookies from 'js-cookie';

interface EditProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const EditProfilePage: React.FC = () => {
  const [form, setForm] = useState<EditProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
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
            password: '',
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
      console.log('Form data being sent:', form);
      if (!res.ok) {
        setError(data.message || 'Profile update failed');
      } else {
        setSuccess('Profile updated successfully!');
        setUser(data);
        navigate('/profilePage')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.' + err);
      console.error(err);
    }
  };

  return (
    <div className={styles.Container}>
      <h2>Edit Profile</h2>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
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
          <div>
            <p>Email</p>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            {/* <p>Password</p>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            /> */}
          </div>
          <button type="submit" className={styles.btt}>Save Changes</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
};
