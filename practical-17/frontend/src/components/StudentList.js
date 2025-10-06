import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    const res = await api.get('/');
    setStudents(res.data);
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/${id}`);
      loadStudents();
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    
    <div>
      <h1 className="text-center mb-4">Student Records</h1>
      <Link to="/add" className="btn btn-success mb-3">Add Student</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.age}</td>
              <td>{student.contact}</td>
              <td>
                <Link to={`/edit/${student._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                <button onClick={() => deleteStudent(student._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
