import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore'
import { fetchUsers } from '../store/allUsersStore'


export default function Password() {
  // const {register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  let history = useHistory();
  const { id, admin } = useSelector((state) => state.auth); // assuming `admin` is part of your auth state
  const user = useSelector((state) => state.singleUser);
  const allUsers = useSelector((state) => state.allUsers);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(id);

  useEffect(() => {
    dispatch(fetchSingleUser(id));
    if (admin) {
      dispatch(fetchUsers()); // Fetch all users if the user is an admin
    }
  }, [dispatch, id, admin]);



const handleUpdate =(event) => {
  event.preventDefault()
  setName(user.username)
  setAvatar(user.imageUrl)
  setPassword(user.password)
  setEditProfile(id)
}



const handleChange = (event) => {
  event.preventDefault()
  setName(event.target.value)
}



const handleChangePassword = (event) => {
  setPassword(event.target.value);
};


const handleChangeConfirmPassword = (event) => {
  event.preventDefault();
  setConfirmPassword(event.target.value);
};

const handleUserChange = (event) => {
  setSelectedUserId(event.target.value); // update the selected user ID
};



const handleClick = (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const updatedInfo = {
    id: selectedUserId, // use the selected user ID
    password,
  };

  dispatch(updateSingleUser(updatedInfo));
  console.log("Password Updated");
  history.push('/profile');
};


  return (
    <div className="text-center">
    <h1 className="profile rounded text-center add" style={{ marginBottom: "15px", marginTop: "25px",  marginLeft: "auto", marginRight: "auto", width: "35%" }}
    ><b>Password</b></h1>
     {admin && (
        <div>
          <label htmlFor="userSelect"><b>Select User:</b></label>
          <select name="userSelect" onChange={handleUserChange} value={selectedUserId}>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      )}
       <div >
        {/* <form className="col" onSubmit={handleSubmit(handleClick)}> */}
  <div>
    <div className="col">
      <label>
        <h2 htmlFor="password" >
         <b>New Password:{" "}</b>
        </h2>{" "}
      </label>
      <input
        name="password"
        onChange={handleChangePassword}
        type="password"
        placeholder="New Password"
      />
    </div>
  </div>
  <div style={{marginTop: "10px", marginBottom: "10px"}} >
  <label>
    <h2 htmlFor="confirmPassword" >
      <b>Confirm Password:{" "}</b>
    </h2>{" "}
  </label>
  <input
    name="confirmPassword"
    onChange={handleChangeConfirmPassword}
    type="password"
    placeholder="Confirm Password"
  />
</div >
    <button className='btn btn-primary' style={{marginTop: "10px", marginBottom: "10px"}} onClick={handleClick}>Update Password</button>
  </div>
  <div><Link to={`/profile`}>Back to Profile</Link></div>
    </div>
  )
}
