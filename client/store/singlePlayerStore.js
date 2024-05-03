import axios from "axios";

// Action Types
const SET_SINGLE_PLAYER = "SET_SINGLE_PLAYER";
const UPDATE_SINGLE_PLAYER = "UPDATE_SINGLE_PLAYER";
const TOKEN = "token";

// Action creators
export const _setSinglePlayer= (playerdata) => {
  return {
    type: SET_SINGLE_PLAYER,
    playerdata,
  };
};

const _updateSinglePlayer = (playerdata) => {
  return {
    type: UPDATE_SINGLE_PLAYER,
    playerdata,
  };
};

//Thunks
export const fetchPlayer = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/players/${id}`);
    dispatch(_setSinglePlayer(data));
  };
};

export const updateSinglePlayer = (player, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/players/${player.id}`, player);
        const { data: playerData } = await axios.get(`/api/players/${player.id}`);
        dispatch(_updateSinglePlayer(playerData));
        history.push(`/players/${player.id}`)
      }
     catch (error) {
      console.log("PLAYER", player)
    }
  };
};

// reducer
const initialState = [];
const singlePlayerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_PLAYER:
      return action.playerdata;
    case UPDATE_SINGLE_PLAYER:
      return action.playerdata;
    default:
      return state;
  }
};

export default singlePlayerReducer;
