import React, { useState, useEffect, ChangeEvent } from 'react';
import styles from '../auth/Signup.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { apiClient } from '../../../../api/client';

interface AddressData {
  country: string;
  city: string;
  postalCode: string;
  street: string;
  state: string;
}

interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  addresses: AddressData;
}

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userData } = useAuth();
  const [form, setForm] = useState<EditProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    addresses: {
      country: '',
      city: '',
      postalCode: '',
      street: '',
      state: ''
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        addresses: userData.addresses ? {
          country: userData.addresses.country ?? '',
          city: userData.addresses.city ?? '',
          postalCode: userData.addresses.postalCode ?? '',
          street: userData.addresses.street ?? '',
          state: userData.addresses.state ?? ''
        } : {
          country: '',
          city: '',
          postalCode: '',
          street: '',
          state: ''
        }
      });
    }
  }, [userData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['country', 'city', 'postalCode', 'street','state'].includes(name)) {
        setForm({
            ...form,
            addresses: {
                ...form.addresses,
                [name]: value
            }
        });
    } else {
        setForm({ 
            ...form, 
            [name]: value 
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await apiClient.put('/users/me', form);
      setSuccess('Profile updated successfully!');
      navigate('/profilePage');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Redirecting to login...</div>;

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

            <hr className="my-4" />
                <h5 className="mb-3">Address Information (Optional)</h5>
                  <div className="mb-3">
                    <label className="form-label">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={form.addresses.street}
                        onChange={handleChange}
                        className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.addresses.city}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control"
                      value={form.addresses.postalCode}
                      onChange={handleChange}
                      
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={form.addresses.state}
                      onChange={handleChange}
                      
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      value={form.addresses.country}
                      onChange={handleChange}
                      
                    />
                  </div>
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
