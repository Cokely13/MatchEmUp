import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore';
import { Link } from 'react-router-dom';

const categories = ['All', 'Shows', 'State', 'Music', 'Qb', 'Nba', 'Movies'];

const Leaderboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.allUsers);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const countCategory = (records, category) => {
    return records.reduce((acc, record) => {
      if (category === 'All' || record.category === category) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <Link to="/home" style={{ color: 'white' }}>Home</Link>
      <div>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Wins ({selectedCategory})</th>
            <th>Losses ({selectedCategory})</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{countCategory(user.wins, selectedCategory)}</td>
              <td>{countCategory(user.losses, selectedCategory)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
