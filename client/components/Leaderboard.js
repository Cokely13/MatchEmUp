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

  const sortedRecord = [...users].sort((a,b) => {
    b.recordStreak - a.recordStreak;
  })

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
    <div className="leaderboard" >
      <h1>Leaderboard</h1>
      <div>
        <div>
          <select className='' onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select className='select' onChange={handleSortingChange} value={sortingCriteria} >
            {sortingOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="table" >
        <thead>
          <tr >
            <th >Name</th>
            <th >Wins ({selectedCategory})</th>
            <th >Losses ({selectedCategory})</th>
            <th >Win %</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id}>
              <td >{user.username}</td>
              <td >{countCategory(user.wins, selectedCategory)}</td>
              <td >{countCategory(user.losses, selectedCategory)}</td>
              <td >{calculateWinPercentage(countCategory(user.wins, selectedCategory), countCategory(user.losses, selectedCategory))}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="table" >
        <thead>
          <tr >
            <th >Name</th>
            <th >Record Streak</th>
            <th >Current Streak</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecord.map(user => (
            <tr key={user.id}>
              <td >{user.username}</td>
              <td >{user.recordStreak}</td>
              <td >{user.currentStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

