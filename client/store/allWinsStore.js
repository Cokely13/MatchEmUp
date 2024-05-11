import Axios from "axios";

const SET_WINS ="SET_WINS"
const CREATE_WIN = "CREATE_WIN"
const DELETE_WIN = "DELETE_WIN"


export const setWins = (win) =>{
  return{
    type: SET_WINS,
    win
  }
};

const _createWin = (win) => {
  return {
    type: CREATE_WIN,
    win,
  };
};

const _deleteWin = (win) => {
  return {
    type: DELETE_WIN,
    win
  };
};

export const fetchWins = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/wins");
        dispatch(setWins(data));
  };
};

export const createWin = (win) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/wins", win);
    dispatch(_createWin(created));
    // history.push("/wins");
  };
};

export const deleteWin = (id, history) => {
  return async (dispatch) => {
    const { data: win } = await Axios.delete(`/api/wins/${id}`);
    dispatch(_deleteWin(win));
    history.push("/wins");
  };
};


const initialState = [];
export default function winsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WINS:
      return action.win;
      case CREATE_WIN:
        return [...state, action.win];
        case DELETE_WIN:
      return state.filter((win) => win.id !== action.win.id)
      ;
      default:
        return state;
    }
  }
