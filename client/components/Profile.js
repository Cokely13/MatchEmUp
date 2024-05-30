import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import { useHistory } from 'react-router-dom';

function Profile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useSelector(state => state.auth);
  const user = useSelector(state => state.singleUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleUser(id));
  }, [dispatch, id]);

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
        alert('Photo uploaded and profile updated successfully');
        setNewPhoto(false);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed');
    }
  };

  const handleDetailsToggle = () => {
    setDetails(!details);
  };

  const handlePasswordChange = () => {
    history.push('/password');
  };

  const countCategory = (records, category) => records.reduce((acc, record) => (category === 'All' || record.category === category) ? acc + 1 : acc, 0);

  const calculateWinPercentage = (wins, losses) => {
    const totalGames = wins + losses;
    return totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "0.00";
  };

    let movieWins = countCategory(user.wins, 'Movies');
  let showWins = countCategory(user.wins, 'Shows');
  let movieLosses = countCategory(user.losses, 'Movies');
  let showLosses = countCategory(user.losses, 'Shows');
  let moviePercentage = calculateWinPercentage(movieWins, movieLosses);
  let showPercentage = calculateWinPercentage(showWins, showLosses);
  let stateWins = countCategory(user.wins, 'State');
  let musicWins = countCategory(user.wins, 'Music');
  let stateLosses = countCategory(user.losses, 'State');
  let musicLosses = countCategory(user.losses, 'Music');
  let musicPercentage = calculateWinPercentage(musicWins, musicLosses);
  let statePercentage = calculateWinPercentage(stateWins, stateLosses);
  let qbWins = countCategory(user.wins, 'Qb');
  let nbaWins = countCategory(user.wins, 'Nba');
  let qbLosses = countCategory(user.losses, 'Qb');
  let nbaLosses = countCategory(user.losses, 'Nba');
  let nbaPercentage = calculateWinPercentage(nbaWins, nbaLosses);
  let qbPercentage = calculateWinPercentage(qbWins, qbLosses);

  return (
    <div className="profile-container">
      <h1 className="profile-header">My Profile</h1>
      {user.image && (
        <div className="user-image-container" style={{ backgroundImage: `url('${user.image}')` }} />
      )}
      <div className="profile-info">
  <div><b>Email:</b><span style={{ fontWeight: 'bold', color: 'black' }}> {user.email ? user.email : 'No Email'}</span></div>
  <div><b>Total Plays:</b><span style={{ fontWeight: 'bold', color: 'black' }}> {user.wins.length + user.losses.length}</span> </div>
  <div><b>Wins:</b><span style={{ fontWeight: 'bold', color: 'black' }}> {user.wins.length}</span> </div>
  <div><b>Losses:</b><span style={{ fontWeight: 'bold', color: 'black' }}>  {user.losses.length}</span> </div>
  <div><b>Current Streak:</b><span style={{ fontWeight: 'bold', color: 'black' }}>  {user.currentStreak}</span> </div>
  <div><b>Record Streak:</b><span style={{ fontWeight: 'bold', color: 'black' }}>  {user.recordStreak}</span> </div>
  <button className="details-toggle" onClick={handleDetailsToggle}>
    {details ? 'Hide Details' : 'Show Details'}
  </button>
</div>
      {details  ? <table className="table" >
         <thead>
           <tr >
             <th >Category</th>
             <th >Wins </th>
             <th >Losses</th>
             <th >Win %</th>
           </tr>
         </thead>
         <tbody>
         <tr>
               <td >Movie</td>
               <td >{movieWins}</td>
               <td >{movieLosses}</td>
               <td >{moviePercentage}%</td>
               </tr>
               <tr >
               <td >Shows</td>
               <td >{showWins}</td>
               <td >{showLosses}</td>
               <td >{showPercentage}%</td>
               </tr>
               <tr>
               <td >Music</td>
               <td >{musicWins}</td>
               <td >{musicLosses}</td>
               <td >{musicPercentage}%</td>
               </tr>
               <tr >
               <td >State</td>
               <td >{stateWins}</td>
               <td >{stateLosses}</td>
               <td >{statePercentage}%</td>
               </tr>
               <tr>
               <td >Nba</td>
               <td >{nbaWins}</td>
               <td >{nbaLosses}</td>
               <td >{nbaPercentage}%</td>
               </tr>
               <tr >
               <td >Qb</td>
               <td >{qbWins}</td>
               <td >{qbLosses}</td>
               <td >{qbPercentage}%</td>
               </tr>
         </tbody>
       </table> : <div></div>}
       <button className="btn btn-primary" onClick={handlePasswordChange}>Change Password</button>
      {newPhoto ? (
        <div>
          <input type="file" onChange={handleFileChange} />
          <button className="btn btn-success" onClick={handleUpload}>Upload Photo</button>
          {previewUrl && (
            <div className="preview-image-container">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>
      ) : (
        <button className="btn btn-secondary" onClick={() => setNewPhoto(true)}>Change Photo</button>
      )}
    </div>
  );
}

export default Profile;
