// import React from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function VendorProfile() {
  const { userData, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/vendor/edit`)
  };

  const handleDelete = async (id: number) => {
    if(window.confirm('Are you sure you want to delete this vendor?')) {
      try{
        await axios.delete(`http://localhost:3333/vendor/${id}`);
        setTimeout(() => navigate('/vendor/signin'), 1500);
      }catch(err: any){
        alert('Failed to delete vendor: ' + (err.response?.data?.message || err.message));
      }
    }
  }

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (!isAuthenticated) return <div className="text-center mt-5">You are not logged in.</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="row">
          {/* Profile Picture */}
          <div className="col-md-3 d-flex justify-content-center align-items-center mb-4 mb-md-0">
            <img
              src="/placeholder-profile.png"
              alt="Vendor Avatar"
              className="rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>

          {/* Vendor Info */}
          <div className="col-md-9">
            <h3 className="mb-3">Welcome, {userData?.name}</h3>

            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Name:</strong>
                <p>{userData?.name}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Phone Number:</strong>
                <p>{userData?.phone_number}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Business Name:</strong>
                <p>{userData?.businessName}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong>
                <p>{userData?.email}</p>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-4">
              <h5>Business Address</h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <strong>Street:</strong>
                  <p>{userData?.addresses?.street || '-'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <strong>City:</strong>
                  <p>{userData?.addresses?.city || '-'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <strong>State:</strong>
                  <p>{userData?.addresses?.state || '-'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Postal Code:</strong>
                  <p>{userData?.addresses?.postalCode || '-'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Country:</strong>
                  <p>{userData?.addresses?.country || '-'}</p>
                </div>
              </div>
            </div>
            <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit()}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(userData?.id)}>
                    Delete
                  </button>
          </div>
        </div>
      </div>
    </div>
  );
}
