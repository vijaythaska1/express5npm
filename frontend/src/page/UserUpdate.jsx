import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../axios';

function UserUpdate() {
  const { id } = useParams();
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await http.get(`/userFindById/${id}`);
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.put(`/userUpdate/${id}`, user);
      if (response.data.success) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);

    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div>
      <h2>Update User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default UserUpdate;
