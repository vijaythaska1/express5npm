import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TableListing() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3434/userFindAll');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:3434/userDelete/${userId}`);

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
        // fetchUsers();
      }
    } catch (error) {
      console.log(error);

    }
  };

  

  return (
    <div>
      <h2>User List</h2>
      <button onClick={() => navigate("/UserAdd")}>Add User</button>
      {users.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button onClick={() => navigate(`/UserUpdate/${user._id}`)}>Update</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default TableListing;
