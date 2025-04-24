import React, { useState, useEffect, ChangeEvent } from 'react';
import styles from '../auth/Signup.module.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
  // currentPassword: string;
  // newPassword?: string;
  addresses: AddressData;
}

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<EditProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    // currentPassword: '',
    // newPassword: '',
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
    const token = Cookies.get('access_token');

    if (!token) {
      setError('User is not authenticated.');
      return;
    }

    fetch('http://localhost:3333/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setForm(prev => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          addresses: data.addresses ? {
            country: data.addresses.country ?? '',
            city: data.addresses.city ?? '',
            postalCode: data.addresses.postalCode ?? '',
            street: data.addresses.street ?? '',
            state: data.addresses.state ?? ''
          } : {
            country: '',
            city: '',
            postalCode: '',
            street: '',
            state: ''
          }
        }));
      })
      .catch(err => {
        setError('Failed to fetch user data.');
        console.error(err);
      });
  }, []);

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

    const token = Cookies.get('access_token');

    if (!token) {
      setError('User is not authenticated.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3333/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
            {/* <hr className="my-4" /> */}
            {/* <label>Current Password</label>
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
            /> */}
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
