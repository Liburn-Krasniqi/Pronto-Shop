import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CategoryFormData{
    name : string;
    description: string;
}

interface Message{
    type : 'success' | 'danger';
    text: string;
}


export function EditCategory(){
    const {id} = useParams()
    const navigate = useNavigate();

    const [form, setForm] = useState<CategoryFormData>({
        name : '',
        description: ''
    })

    const [message, setMessage] = useState<Message | null>(null)

    useEffect(() => {
        axios.get(` http://localhost:3333/category/${id}`)
            .then(res =>{
                const data = res.data;
                setForm({
                    name : data.name || '',
                    description: data.description || ''
                })
            })
            .catch(()=> {
                setMessage({ type: 'danger', text: 'Failed to load Category.' });
            })
    }, [id])

    console.log(form.name)

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        setForm({
            ...form,
            [name] : value
        })
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();

        const payload: CategoryFormData = {
            ...form
        };

        try{
            await axios.patch(`http://localhost:3333/category/${id}`, payload);
            setMessage({ type: 'success', text: 'Category updated successfully!' });
            setTimeout(() => navigate('/category/show'), 1500);
        }catch(err:any){
            const errorText = err.response?.data?.message || err.message;
            setMessage({ type: 'danger', text: `Update failed: ${errorText}` });
        }
    }

    return(
        <div className="container mt-5">
            <div className='text-center mb-5'>
                <img alt="Pronto Logo" src="/letter-p.svg" />
            </div>      
            <div className="row justify-content-center">
                <div className="col-md-8 mb-5">
                <div className="card rounded-4 shadow-bottom border-0">
                    <div className="card-body p-4">
                    <h3 className="card-title text-center mb-4 color-1 mb-4">Edit Category</h3>

                    {message && (
                        <div className={`alert alert-${message.type}`} role="alert">
                        {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Category Name</label>
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
                        <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                        Edit Category
                        </button>
                    
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>

    )
}