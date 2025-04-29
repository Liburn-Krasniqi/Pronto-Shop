import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Subcategory{
    id: number;
    name: string;
    description: string
}

interface Category {
    id: number;
    name: string;
    description: string;
    subcategories: Subcategory[]
}

export function ShowCategory(){
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:3333/category')
            .then(res => {
                setCategories(res.data);
            })
            .catch(err =>{
                setError(err.message || 'Failed to fetch categories')
            })
    } , [])
    

    const handleEdit = async(id:number) => {
        navigate(`/category/edit/${id}`)
    }

    const handleDelete = async(id:number) => {
        if(window.confirm('Are you sure you want to delete this category?')){
            try{
                await axios.delete(`http://localhost:3333/category/${id}`);
                setCategories(prev => prev.filter(c => c.id !== id));
            }catch(err:any){
                alert('Failed to delete category' + (err.response?.data?.message || err.message));
            }
        }
    }


    return(
        <div className="container mt-5">
      <h2 className="mb-4 text-center">All Registered Businesses</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="color-1">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} >
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  {category.subcategories.length > 0 ? (
                    <ul className="mb-0 ps-3">
                      {category.subcategories.map((sub) => (
                          <li key={sub.id}>{sub.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <em>No Subcategories</em>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(category.id)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
}