import axios from "axios";

// Action Types
const SET_SINGLE_SHOW = "SET_SINGLE_SHOW";
const UPDATE_SINGLE_SHOW = "UPDATE_SINGLE_SHOW";
const TOKEN = "token";

// Action creators
export const _setSingleShow= (showdata) => {
  return {
    type: SET_SINGLE_SHOW,
    showdata,
  };
};

const _updateSingleShow = (showdata) => {
  return {
    type: UPDATE_SINGLE_SHOW,
    showdata,
  };
};

//Thunks
export const fetchShow = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/shows/${id}`);
    dispatch(_setSingleShow(data));
  };
};

export const updateSingleShow = (show, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/shows/${show.id}`, show);
        const { data: showData } = await axios.get(`/api/shows/${show.id}`);
        dispatch(_updateSingleShow(showData));
        history.push(`/shows/${show.id}`)
      }
     catch (error) {
      console.log("SHOW")
    }
  };
};

// reducer
const initialState = [];
const singleShowReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_SHOW:
      return action.showdata;
    case UPDATE_SINGLE_SHOW:
      return action.showdata;
    default:
      return state;
  }
};

export default singleShowReducer;
