import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface VendorFormData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone_number: string;
  country: string;
  city: string;
  zipCode: string;
  street: string;
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}

export function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<VendorFormData>({
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone_number: '',
    country: '',
    city: '',
    zipCode: '',
    street: ''
  });

  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Fetch vendor data by ID and populate the form
    axios.get(`http://localhost:3333/vendor/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '', // do not prefill password
          businessName: data.businessName || '',
          phone_number: data.phone_number || '',
          country: data.country || '',
          city: data.city || '',
          zipCode: data.zipCode || '',
          street: data.street || '',
        });
      })
      .catch(err => {
        setMessage({ type: 'danger', text: 'Failed to load vendor data.' });
      });
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
        country: form.country,
        city: form.city,
        zipCode: form.zipCode,
        street: form.street
    };

    try {
      await axios.patch(`http://localhost:3333/vendor/${id}`, payload);
      setMessage({ type: 'success', text: 'Vendor updated successfully!' });
      setTimeout(() => navigate('/vendor/show'), 1500); // redirect after update
    } catch (err: any) {
      const errorText = err.response?.data?.message || err.message;
      setMessage({ type: 'danger', text: `Update failed: ${errorText}` });
    }
  };

  return (
    <div className="container mt-5">
      <div className='text-center mb-5'>
        <img alt="Pronto Logo" src="/letter-p.svg" />
      </div> 
      <div className="row justify-content-center">
        <div className="col-md-8 mb-5">
          <div className="card rounded-4 shadow-bottom border-0">
            <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 color-1 mb-4">
              Edit <span className='color-1'>ProntoBusiness</span> Account
            </h3>

              {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      className="form-control"
                      value={form.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
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

                  <div className="mb-3 col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      className="form-control"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <hr className="my-4" />
                <h5 className="mb-3">Address Information</h5>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      name="street"
                      className="form-control"
                      value={form.street}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      value={form.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                  Edit Account
                </button>
               
              </form> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
