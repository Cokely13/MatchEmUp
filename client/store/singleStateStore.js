import axios from "axios";

// Action Types
const SET_SINGLE_STATE = "SET_SINGLE_STATE";
const UPDATE_SINGLE_STATE = "UPDATE_SINGLE_STATE";
const TOKEN = "token";

// Action creators
export const _setSingleState= (statedata) => {
  return {
    type: SET_SINGLE_STATE,
    statedata,
  };
};

const _updateSingleState = (statedata) => {
  return {
    type: UPDATE_SINGLE_STATE,
    statedata,
  };
};

//Thunks
export const fetchState = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/states/${id}`);
    dispatch(_setSingleState(data));
  };
};

export const updateSingleState = (state, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/states/${state.id}`, state);
        const { data: stateData } = await axios.get(`/api/states/${state.id}`);
        dispatch(_updateSingleState(stateData));
        history.push(`/states/${state.id}`)
      }
     catch (error) {
      console.log("STATE", state)
    }
  };
};

// reducer
const initialState = [];
const singleStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_STATE:
      return action.statedata;
    case UPDATE_SINGLE_STATE:
      return action.statedata;
    default:
      return state;
  }
};

export default singleStateReducer;
