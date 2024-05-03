import axios from "axios";

// Action Types
const SET_SINGLE_FRANCHISE = "SET_SINGLE_FRANCHISE";
const UPDATE_SINGLE_FRANCHISE = "UPDATE_SINGLE_FRANCHISE";
const TOKEN = "token";

// Action creators
export const _setSingleFranchise= (franchisedata) => {
  return {
    type: SET_SINGLE_FRANCHISE,
    franchisedata,
  };
};

const _updateSingleFranchise = (franchisedata) => {
  return {
    type: UPDATE_SINGLE_FRANCHISE,
    franchisedata,
  };
};

//Thunks
export const fetchFranchise = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/franchises/${id}`);
    dispatch(_setSingleFranchise(data));
  };
};

export const updateSingleFranchise = (franchise, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/franchises/${franchise.id}`, franchise);
        const { data: franchiseData } = await axios.get(`/api/franchises/${franchise.id}`);
        dispatch(_updateSingleFranchise(franchiseData));
        history.push(`/franchises/${franchise.id}`)
      }
     catch (error) {
      console.log("FRANCHISE", franchise)
    }
  };
};

// reducer
const initialState = [];
const singleFranchiseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_FRANCHISE:
      return action.franchisedata;
    case UPDATE_SINGLE_FRANCHISE:
      return action.franchisedata;
    default:
      return state;
  }
};

export default singleFranchiseReducer;
