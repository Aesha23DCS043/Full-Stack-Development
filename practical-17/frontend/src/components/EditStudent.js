import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({ name: '', email: '', course: '', age: '', contact: '' });

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await api.get(`/${id}`);
      setStudent(res.data);
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/${id}`, student);
    navigate('/');
  };

  return (
    <div>
      <h1 className="text-center mb-4">Edit Student</h1>
      <form onSubmit={handleSubmit}>
        {['name','email','course','age','contact'].map(field => (
          <input
            key={field}
            type={field === 'email' ? 'email' : field === 'age' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={student[field]}
            onChange={handleChange}
            className="form-control mb-2"
            required
          />
        ))}
        <button type="submit" className="btn btn-primary w-100">Update Student</button>
      </form>
    </div>
  );
}

export default EditStudent;
