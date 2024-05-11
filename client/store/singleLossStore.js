import axios from "axios";

// Action Types
const SET_SINGLE_LOSS = "SET_SINGLE_LOSS";
const UPDATE_SINGLE_LOSS = "UPDATE_SINGLE_LOSS";
const TOKEN = "token";

// Action creators
export const _setSingleLoss= (lossdata) => {
  return {
    type: SET_SINGLE_LOSS,
    lossdata,
  };
};

const _updateSingleLoss = (lossdata) => {
  return {
    type: UPDATE_SINGLE_LOSS,
    lossdata,
  };
};

//Thunks
export const fetchLoss = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/losses/${id}`);
    dispatch(_setSingleLoss(data));
  };
};

export const updateSingleLoss = (loss, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/losses/${loss.id}`, loss);
        const { data: lossData } = await axios.get(`/api/losses/${loss.id}`);
        dispatch(_updateSingleLoss(lossData));
        history.push(`/losses/${loss.id}`)
      }
     catch (error) {
      console.log("LOSS", loss)
    }
  };
};

// reducer
const initialState = [];
const singleLossReducer = (loss = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_LOSS:
      return action.lossdata;
    case UPDATE_SINGLE_LOSS:
      return action.lossdata;
    default:
      return loss;
  }
};

export default singleLossReducer;
