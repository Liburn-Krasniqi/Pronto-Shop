import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import Cookies from 'js-cookie';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const profileEditPage = () => {
    navigate('/EditProfilePage');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        setError('You are not authorized. Please log in.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3333/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err: any) {
        setError('Something went wrong. Please try again.');
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleDeleteProfile = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setError('You are not authorized to delete this profile.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3333/users/me', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        Cookies.remove('access_token');
        navigate('/signin');
      } else {
        setError('Failed to delete profile.');
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>User Profile</h2>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {user ? (
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.deleteButton}`}
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>

            <button
              className={`${styles.button} ${styles.updateButton}`}
              onClick={profileEditPage}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};
