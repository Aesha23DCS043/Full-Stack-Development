import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
  const [student, setStudent] = useState({ name: '', email: '', course: '', age: '', contact: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/', student);
    navigate('/');
  };

  return (
    <div>
      <h1 className="text-center mb-4">Add New Student</h1>
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
        <button type="submit" className="btn btn-primary w-100">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudent;
