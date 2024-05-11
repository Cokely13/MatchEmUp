import axios from "axios";

// Action Types
const SET_SINGLE_WIN = "SET_SINGLE_WIN";
const UPDATE_SINGLE_WIN = "UPDATE_SINGLE_WIN";
const TOKEN = "token";

// Action creators
export const _setSingleWin= (windata) => {
  return {
    type: SET_SINGLE_WIN,
    windata,
  };
};

const _updateSingleWin = (windata) => {
  return {
    type: UPDATE_SINGLE_WIN,
    windata,
  };
};

//Thunks
export const fetchWin = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/wins/${id}`);
    dispatch(_setSingleWin(data));
  };
};

export const updateSingleWin = (win, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/wins/${win.id}`, win);
        const { data: winData } = await axios.get(`/api/wins/${win.id}`);
        dispatch(_updateSingleWin(winData));
        history.push(`/wins/${win.id}`)
      }
     catch (error) {
      console.log("WIN", win)
    }
  };
};

// reducer
const initialState = [];
const singleWinReducer = (win = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_WIN:
      return action.windata;
    case UPDATE_SINGLE_WIN:
      return action.windata;
    default:
      return win;
  }
};

export default singleWinReducer;
