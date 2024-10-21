import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserAdd() {
  const [users, setUsers] = useState([{ name: '', email: '', password: '' }]);
  const Navigate =  useNavigate()
 

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newUsers = [...users];
    newUsers[index][name] = value;
    setUsers(newUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3434/usercreate', users);
      if (response.data.success) {
        Navigate("/")
        setUsers([{ name: '', email: '', password: '' }]);
      }
    } catch (error) {
      console.log(error);

    }
  };

  const addUser = () => {
    setUsers([...users, { name: '', email: '', password: '' }]);
  };


  const removeUser = (index) => {
    const newUsers = users.filter((user, i) => i !== index);
    setUsers(newUsers);
  };

  return (
    <div>
      <h2>Add Users</h2>

      <form onSubmit={handleSubmit}>
        {users.map((user, index) => (
          <div key={index} className="user-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            {users.length > 1 && (
              <button type="button" onClick={() => removeUser(index)}>Remove</button>
            )}
          </div>
        ))}

        <button type="button" onClick={addUser}>Add Another User</button>

        <button type="submit">Submit</button>
      </form>

    </div>
  );
}

export default UserAdd;
