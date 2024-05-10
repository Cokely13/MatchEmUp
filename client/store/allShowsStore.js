import Axios from "axios";

const SET_SHOWS ="SET_SHOWS"
const CREATE_SHOW = "CREATE_SHOW"
const DELETE_SHOW = "DELETE_SHOW"


export const setShows = (show) =>{
  return{
    type: SET_SHOWS,
    show
  }
};

const _createShow = (show) => {
  return {
    type: CREATE_SHOW,
    show,
  };
};

const _deleteShow = (show) => {
  return {
    type: DELETE_SHOW,
    show
  };
};

export const fetchShows = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/shows");
        dispatch(setShows(data));
  };
};

export const createShow = (show) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/shows", show);
    dispatch(_createShow(created));
    // history.push("/shows");
  };
};

export const deleteShow = (id, history) => {
  return async (dispatch) => {
    const { data: show } = await Axios.delete(`/api/shows/${id}`);
    dispatch(_deleteShow(show));
    history.push("/shows");
  };
};


const initialState = [];
export default function showsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SHOWS:
      return action.show;
      case CREATE_SHOW:
        return [...state, action.show];
        case DELETE_SHOW:
      return state.filter((show) => show.id !== action.show.id)
      ;
      default:
        return state;
    }
  }
