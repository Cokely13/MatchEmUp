import Axios from "axios";

const SET_STATES ="SET_STATES"
const CREATE_STATE = "CREATE_STATE"
const DELETE_STATE = "DELETE_STATE"


export const setStates = (state) =>{
  return{
    type: SET_STATES,
    state
  }
};

const _createState = (state) => {
  return {
    type: CREATE_STATE,
    state,
  };
};

const _deleteState = (state) => {
  return {
    type: DELETE_STATE,
    state
  };
};

export const fetchStates = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/states");
        dispatch(setStates(data));
  };
};

export const createState = (state) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/states", state);
    dispatch(_createState(created));
    // history.push("/states");
  };
};

export const deleteState = (id, history) => {
  return async (dispatch) => {
    const { data: state } = await Axios.delete(`/api/states/${id}`);
    dispatch(_deleteState(state));
    history.push("/states");
  };
};


const initialState = [];
export default function statesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STATES:
      return action.state;
      case CREATE_STATE:
        return [...state, action.state];
        case DELETE_STATE:
      return state.filter((state) => state.id !== action.state.id)
      ;
      default:
        return state;
    }
  }
