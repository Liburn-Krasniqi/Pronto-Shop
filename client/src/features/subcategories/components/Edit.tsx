import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SubcategoryFormData {
  name: string;
  description: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}

export function EditSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    categoryId: 0
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<Message | null>(null);


  useEffect(() => {
    axios.get('http://localhost:3333/category')
      .then(res => setCategories(res.data))
      .catch(() => setMessage({ type: 'danger', text: 'Failed to load categories.' }));
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:3333/subcategory/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          name: data.name || '',
          description: data.description || '',
          categoryId: data.categoryId || 0
        });
      })
      .catch(() => {
        setMessage({ type: 'danger', text: 'Failed to load subcategory.' });
      });
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'categoryId' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3333/subcategory/${id}`, form);
      setMessage({ type: 'success', text: 'Subcategory updated successfully!' });
      setTimeout(() => navigate('/subcategory/show'), 1500);
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
              <h3 className="card-title text-center mb-4 color-1 mb-4">Edit Subcategory</h3>

              {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Subcategory Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Parent Category</label>
                  <select
                    name="categoryId"
                    className="form-control"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                  Edit Subcategory
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
