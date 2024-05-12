// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUsers } from '../store/allUsersStore';
// import { Link } from 'react-router-dom';

// const categories = ['All', 'Shows', 'State', 'Music', 'Qb', 'Nba', 'Movies'];
// const sortingOptions = ['Wins', 'Losses', 'Win Percentage'];

// const Leaderboard = () => {
//   const dispatch = useDispatch();
//   const users = useSelector(state => state.allUsers);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortingCriteria, setSortingCriteria] = useState('Wins');

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const countCategory = (records, category) => records.reduce((acc, record) => (category === 'All' || record.category === category) ? acc + 1 : acc, 0);

//   // const calculateWinPercentage = (wins, losses) => totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "0.00";
//   const calculateWinPercentage = (wins, losses) => {
//         const totalGames = wins + losses;
//         return totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "0.00";
//       };

//   const sortedUsers = [...users].sort((a, b) => {
//     let aWins = countCategory(a.wins, selectedCategory);
//     let bWins = countCategory(b.wins, selectedCategory);
//     let aLosses = countCategory(a.losses, selectedCategory);
//     let bLosses = countCategory(b.losses, selectedCategory);
//     let aPercentage = calculateWinPercentage(aWins, aLosses);
//     let bPercentage = calculateWinPercentage(bWins, bLosses);

//     switch (sortingCriteria) {
//       case 'Wins':
//         return bWins - aWins;
//       case 'Losses':
//         return bLosses - aLosses;
//       case 'Win Percentage':
//         return bPercentage - aPercentage;
//       default:
//         return bWins - aWins;
//     }
//   });

//   const handleSortingChange = (e) => {
//     setSortingCriteria(e.target.value);
//   };

//   return (
//     <div className="leaderboard">
//       <h1>Leaderboard</h1>
//       <Link to="/home" style={{ color: 'white' }}>Home</Link>
//       <div>
//         <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
//           {categories.map(category => (
//             <option key={category} value={category}>{category}</option>
//           ))}
//         </select>
//         <select onChange={handleSortingChange} value={sortingCriteria}>
//           {sortingOptions.map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//       </div>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Wins ({selectedCategory})</th>
//             <th>Losses ({selectedCategory})</th>
//             <th>Win %</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedUsers.map(user => (
//             <tr key={user.id}>
//               <td>{user.username}</td>
//               <td>{countCategory(user.wins, selectedCategory)}</td>
//               <td>{countCategory(user.losses, selectedCategory)}</td>
//               <td>{calculateWinPercentage(countCategory(user.wins, selectedCategory), countCategory(user.losses, selectedCategory))}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Leaderboard;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/allUsersStore';
import { Link } from 'react-router-dom';

const categories = ['All', 'Shows', 'State', 'Music', 'Qb', 'Nba', 'Movies'];
const sortingOptions = ['Wins', 'Losses', 'Win Percentage'];

const Leaderboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.allUsers);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortingCriteria, setSortingCriteria] = useState('Wins');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const countCategory = (records, category) => records.reduce((acc, record) => (category === 'All' || record.category === category) ? acc + 1 : acc, 0);

  const calculateWinPercentage = (wins, losses) => {
    const totalGames = wins + losses;
    return totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "0.00";
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aWins = countCategory(a.wins, selectedCategory);
    let bWins = countCategory(b.wins, selectedCategory);
    let aLosses = countCategory(a.losses, selectedCategory);
    let bLosses = countCategory(b.losses, selectedCategory);
    let aPercentage = calculateWinPercentage(aWins, aLosses);
    let bPercentage = calculateWinPercentage(bWins, bLosses);

    switch (sortingCriteria) {
      case 'Wins':
        return bWins - aWins;
      case 'Losses':
        return bLosses - aLosses;
      case 'Win Percentage':
        return bPercentage - aPercentage;
      default:
        return bWins - aWins;
    }
  });

  const handleSortingChange = (e) => {
    setSortingCriteria(e.target.value);
  };

  return (
    <div className="leaderboard" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Leaderboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#fff', background: '#007bff', padding: '10px 15px', borderRadius: '5px' }}>Home</Link>
        <div>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select onChange={handleSortingChange} value={sortingCriteria} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
            {sortingOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Wins ({selectedCategory})</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Losses ({selectedCategory})</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Win %</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.username}</td>
              <td style={{ padding:'10px', border: '1px solid #ccc' }}>{countCategory(user.wins, selectedCategory)}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{countCategory(user.losses, selectedCategory)}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{calculateWinPercentage(countCategory(user.wins, selectedCategory), countCategory(user.losses, selectedCategory))}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
