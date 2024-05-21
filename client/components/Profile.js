import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSingleUser } from '../store/singleUserStore'
import { updateSingleUser } from '../store/singleUserStore'



function Profile() {
  const dispatch = useDispatch()
  let history = useHistory();
  const {id} = useSelector((state) => state.auth )
  const user = useSelector((state) => state.singleUser )
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);



  useEffect(() => {
    dispatch(fetchSingleUser(id))
    // Safe to add dispatch to the dependencies array
  }, [dispatch,])


const imageUrl = user.image

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Set the URL for preview
  }
};


const handleUpload = async () => {
  if (!selectedFile) {
    alert('Please select a file to upload');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile);

  console.log("SELECTED FILE", selectedFile)

  try {
    // Upload the photo to your server
    const uploadResponse = await fetch(`/api/users/${user.id}`, {
      method: 'PUT', // Change this to PUT
      body: formData,
    });

    if (uploadResponse.ok) {
      const responseData = await uploadResponse.json();
      // Assuming the server response contains the URL of the uploaded image
      dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
      alert('Photo uploaded and profile updated successfully');
      setNewPhoto(false)
    } else {
      alert('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error);
    alert('Upload failed');
  }
};

const handlePassword = () => {
  history.push('/password');
}

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
    <div className="text-center">
    <h1 className="profile rounded text-center add" style={{ marginBottom: "15px", marginTop: "25px",  marginLeft: "auto", marginRight: "auto", width: "35%" }}><b>{user.username}'s Profile</b></h1>

    {user.image && (
    <div   >
       <div className="user-image-container" style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: 'auto',
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '3px solid black'
            }}> </div>
    </div>
  )}
    <div style={{fontSize:"25px"}} >
    <div><b> {user.email ? user.email : 'No Email'} </b></div>
    <div> Total Plays: {user.wins ? user.wins.length + user.losses.length : 0}</div>
    <div> Wins: {user.wins ? user.wins.length : 0}</div>
    <div> Losses: {user.wins ? user.losses.length : 0}</div>
    <div> MovieWins: {movieWins}</div>
    <div> ShowWins: {showWins}</div>
    <div> MovieLosses: {movieLosses}</div>
    <div> ShowLosses: {showLosses}</div>
    <div> Win Percentage Movies: {moviePercentage}</div>
    <div> Win Percentage Shows: {showPercentage}</div>
    <div> StateWins: {stateWins}</div>
    <div> QbWins: {qbWins}</div>
    <div> StateLosses: {stateLosses}</div>
    <div> QbLosses: {qbLosses}</div>
    <div> Win Percentage State: {statePercentage}</div>
    <div> Win Percentage Qb: {qbPercentage}</div>
    <div> NbaWins: {nbaWins}</div>
    <div> MusicWins: {musicWins}</div>
    <div> NbaLosses: {nbaLosses}</div>
    <div> MusicLosses: {musicLosses}</div>
    <div> Win Percentage Nba: {nbaPercentage}</div>
    <div> Win Percentage Music: {musicPercentage}</div>
    </div>
     <button className="btn btn-primary" onClick={() => handlePassword()}>Change Password</button>
     {newPhoto ? <div style={{ margin: '20px 0' }} >
        <input  type="file" onChange={handleFileChange} />
        <button className="btn btn-success"onClick={handleUpload}>Upload Photo</button>
        {previewUrl && (
          <div className="change-photo-button-container">
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '20%', height: 'auto' }} />
          </div>
        )}
      </div> : <div className="change-photo-button-container"><button className="btn btn-secondary" onClick={() => setNewPhoto(true)}>Change Photo</button></div>}

    </div>
  )
}

export default Profile
