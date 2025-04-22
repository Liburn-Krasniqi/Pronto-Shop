import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AddressData {
  id: number;
  country: string;
  city: string;
  postalCode: string;
  street: string;
  state: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  businessName: string;
  phone_number: string;
  addresses: AddressData[];
}

export function ShowVendor() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3333/vendor')
      .then(res => {
        setVendors(res.data);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch vendors');
      });
  }, []);

  const navigate = useNavigate();
  
  const handleEdit = (id: number) => {
    navigate(`/vendor/edit/${id}`)
  };

  const handleDelete = async(id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
        try {
            await axios.delete(`http://localhost:3333/vendor/${id}`);
            setVendors(prev => prev.filter(v => v.id !== id)); // remove from list
          } catch (err: any) {
            alert('Failed to delete vendor: ' + (err.response?.data?.message || err.message));
          }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">All Registered Businesses</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="color-1">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Business Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Street</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>State</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id} >
                <td>{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>{vendor.businessName}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone_number}</td>
                <td>{vendor.addresses[0]?.street}</td>
                <td>{vendor.addresses[0]?.city}</td>
                <td>{vendor.addresses[0]?.postalCode}</td>
                <td>{vendor.addresses[0]?.state}</td>
                <td>{vendor.addresses[0]?.country}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(vendor.id)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vendor.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}