import React, { useState, useEffect, ChangeEvent } from 'react';
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

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userData, userType } = useAuth();
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

  if(isAuthenticated && userType === 'vendor') navigate('/vendor/profile');

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
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      setError(null);
      try {
        await apiClient.delete('/users/me');
        setSuccess('Profile deleted successfully!');
        setTimeout(() => navigate('/login'), 1500);
      } catch (err: any) {
        setError(err.message || 'Failed to delete profile.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Redirecting to login...</div>;

  return (
    <div className="container mt-5">
      <div className='text-center mb-5'>
        <img alt="Pronto Logo" src="/letter-p.svg" />
      </div>      
      <div className="row justify-content-center">
        <div className="col-md-8 mb-5">
          <div className="card rounded-4 shadow-bottom border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 color-1 mb-4">Edit <span className='color-1'>ProntoShop</span> Profile</h3>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {userData ? (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3 col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <hr className="my-4" />
                  <h5 className="mb-3">Address Information (Optional)</h5>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        name="street"
                        className="form-control"
                        value={form.addresses.street}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3 col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={form.addresses.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        className="form-control"
                        value={form.addresses.postalCode}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={form.addresses.state}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={form.addresses.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDeleteProfile}
                    >
                      Delete Profile
                    </button>
                    <button
                      type="submit"
                      className="btn background-2 text-white"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <p>Loading user information...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
