import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Subcategory {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
}

export function ShowSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("http://localhost:3333/subcategory");
        setSubcategories(res.data);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  const navigate = useNavigate()

    const handleEdit = async(id:number) => {
        navigate(`/subcategory/edit/${id}`)
    }

    const handleDelete = async(id:number) => {
        if(window.confirm('Are you sure you want to delete this category?')){
            try{
                await axios.delete(`http://localhost:3333/subcategory/${id}`);
                setSubcategories(prev => prev.filter(c => c.id !== id));
            }catch(err:any){
                alert('Failed to delete category' + (err.response?.data?.message || err.message));
            }
        }
    }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="color-1">Subcategories List</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-10">
          {loading ? (
            <p>Loading subcategories...</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Parent Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcat) => (
                  <tr key={subcat.id}>
                    <td>{subcat.id}</td>
                    <td>{subcat.name}</td>
                    <td>{subcat.description}</td>
                    <td>{subcat.category?.name ?? "N/A"}</td>
                    <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(subcat.id)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subcat.id)}>
                    Delete
                  </button>
                </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
