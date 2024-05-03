import Axios from "axios";

const SET_FRANCHISES ="SET_FRANCHISES"
const CREATE_FRANCHISE = "CREATE_FRANCHISE"
const DELETE_FRANCHISE = "DELETE_FRANCHISE"


export const setFranchises = (franchise) =>{
  return{
    type: SET_FRANCHISES,
    franchise
  }
};

const _createFranchise = (franchise) => {
  return {
    type: CREATE_FRANCHISE,
    franchise,
  };
};

const _deleteFranchise = (franchise) => {
  return {
    type: DELETE_FRANCHISE,
    franchise
  };
};

export const fetchFranchises = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/franchises");
        dispatch(setFranchises(data));
  };
};

export const createFranchise = (franchise) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/franchises", franchise);
    dispatch(_createFranchise(created));
    // history.push("/franchises");
  };
};

export const deleteFranchise = (id, history) => {
  return async (dispatch) => {
    const { data: franchise } = await Axios.delete(`/api/franchises/${id}`);
    dispatch(_deleteFranchise(franchise));
    history.push("/franchises");
  };
};


const initialState = [];
export default function franchisesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FRANCHISES:
      return action.franchise;
      case CREATE_FRANCHISE:
        return [...state, action.franchise];
        case DELETE_FRANCHISE:
      return state.filter((franchise) => franchise.id !== action.franchise.id)
      ;
      default:
        return state;
    }
  }
