import Axios from "axios";

const SET_LOSSES ="SET_LOSSES"
const CREATE_LOSS = "CREATE_LOSS"
const DELETE_LOSS = "DELETE_LOSS"


export const setLosses = (loss) =>{
  return{
    type: SET_LOSSES,
    loss
  }
};

const _createLoss = (loss) => {
  return {
    type: CREATE_LOSS,
    loss,
  };
};

const _deleteLoss = (loss) => {
  return {
    type: DELETE_LOSS,
    loss
  };
};

export const fetchLosses = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/losses");
        dispatch(setLosses(data));
  };
};

export const createLoss = (loss) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/losses", loss);
    dispatch(_createLoss(created));
    // history.push("/losses");
  };
};

export const deleteLoss = (id, history) => {
  return async (dispatch) => {
    const { data: loss } = await Axios.delete(`/api/losses/${id}`);
    dispatch(_deleteLoss(loss));
    history.push("/losses");
  };
};


const initialState = [];
export default function lossesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOSSES:
      return action.loss;
      case CREATE_LOSS:
        return [...state, action.loss];
        case DELETE_LOSS:
      return state.filter((loss) => loss.id !== action.loss.id)
      ;
      default:
        return state;
    }
  }
