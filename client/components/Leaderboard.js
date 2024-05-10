import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore'

const Leaderboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.allUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Sort users by wins in descending order
  const sortedUsers = users.sort((a, b) => b.wins - a.wins);

  console.log("users", users)

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="grid">
        {sortedUsers.map(user => (
          <div key={user.id} className="grid-item">
            <p>{user.username}</p>
            <p>Wins: {user.wins}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
