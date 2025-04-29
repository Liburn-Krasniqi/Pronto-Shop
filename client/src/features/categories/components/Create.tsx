import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


interface CreateCategoryData{
    name: string;
    description: string;
}

interface Message{
    type : 'success' | 'danger',
    text: string
}

export function CreateCategory(){
    const[form, setForm] =useState<CreateCategoryData>({
        name : '',
        description : ''
    })

    const navigate = useNavigate();
    const [message, setMessage] = useState<Message | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name] : value
        });
    }

    const handleSubmit = async (e : FormEvent) => {
        e.preventDefault();

        try{
            const res = await axios.post('http://localhost:3333/category/create', form);
            setMessage({type: 'success', text: `Category "${res.data.name}" created successfully!`});
            setForm({
                name: '',
                description: ''
            });
            setTimeout(() => navigate('/category/show'), 1500);
        }catch(err: any){
            const errorText = err.response?.data?.message || err.message;
            setMessage({type: 'danger', text: `Failed to create category: ${errorText}`});
        }
    };



    return(
        <div className="container mt-5">
            <div className='text-center mb-5'>
                <img alt="Pronto Logo" src="/letter-p.svg" />
            </div>      
            <div className="row justify-content-center">
                <div className="col-md-8 mb-5">
                <div className="card rounded-4 shadow-bottom border-0">
                    <div className="card-body p-4">
                    <h3 className="card-title text-center mb-4 color-1 mb-4">Create New Category</h3>

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
                        Create Category
                        </button>
                    
                    </form>
                    </div>
                </div>
                </div>
            </div>
    </div>
    );
}