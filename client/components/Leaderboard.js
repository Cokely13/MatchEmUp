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


  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      {/* <div className="grid">
        {sortedUsers.map(user => (
          <div key={user.id} className="grid-item">
            <p>{user.username}</p>
            <p>Wins: {user.wins}</p>
          </div>
        ))}
      </div> */}
      <table className="table table-bordered text-center my-challenges-table" style= {{backgroundColor:"rgb(211, 211, 211)"}}>
  <thead>
    <tr style={{ fontSize: "30px", backgroundColor: "rgb(150, 150, 150)" }}>
    <th scope="col">Name</th>
    <th scope="col">Wins</th>
    <th scope="col">Losses</th>
    </tr>
  </thead>
  <tbody  style= {{fontSize:"20px"}} >
  {sortedUsers.map(user => (
          <tr key={user.id} className="grid-item">
            <td scope="row">{user.username}</td>
            <td scope="row">{user.wins}</td>
            <td scope="row">{user.losses}</td>
          </tr>
        ))}


          </tbody>
                       </table>
    </div>
  );
};

export default Leaderboard;
