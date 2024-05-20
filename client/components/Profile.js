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


console.log("user", user)

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

    <div> Wins: {user.wins ? user.wins.length : 0}</div>
    <div> Losses: {user.wins ? user.losses.length : 0}</div>
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
