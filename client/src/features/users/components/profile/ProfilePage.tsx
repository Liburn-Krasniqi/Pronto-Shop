import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { useAuth } from '../../../../hooks/useAuth';
import { apiClient } from '../../../../api/client';

export const ProfilePage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading, userData, userType } = useAuth();

  if(isAuthenticated && userType === 'vendor') navigate('/vendor/profile');


  const profileEditPage = () => {
    navigate('/editProfilePage');
  };

  const handleDeleteProfile = async () => {
    setError(null);
    
    try {
      await apiClient.delete('/users/me');
      setSuccess('Profile deleted successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to delete profile.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Redirecting to login...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>User Profile</h2>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <div className="success-message">{success}</div>}

      {userData ? (
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <p><strong>First Name:</strong> {userData.firstName}</p>
            <p><strong>Last Name:</strong> {userData.lastName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>

          {userData.addresses && (
            <div className="address-info">
              <h3>Address</h3>
              <p><strong>Street:</strong> {userData.addresses.street}</p>
              <p><strong>City:</strong> {userData.addresses.city}</p>
              <p><strong>State:</strong> {userData.addresses.state}</p>
              <p><strong>Postal Code:</strong> {userData.addresses.postalCode}</p>
              <p><strong>Country:</strong> {userData.addresses.country}</p>
            </div>
          )}

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
