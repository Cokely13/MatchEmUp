import Axios from "axios";

const SET_PLAYERS ="SET_PLAYERS"
const CREATE_PLAYER = "CREATE_PLAYER"
const DELETE_PLAYER = "DELETE_PLAYER"


export const setPlayers = (player) =>{
  return{
    type: SET_PLAYERS,
    player
  }
};

const _createPlayer = (player) => {
  return {
    type: CREATE_PLAYER,
    player,
  };
};

const _deletePlayer = (player) => {
  return {
    type: DELETE_PLAYER,
    player
  };
};

export const fetchPlayers = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/players");
        dispatch(setPlayers(data));
  };
};

export const createPlayer = (player) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/players", player);
    dispatch(_createPlayer(created));
    // history.push("/players");
  };
};

export const deletePlayer = (id, history) => {
  return async (dispatch) => {
    const { data: player } = await Axios.delete(`/api/players/${id}`);
    dispatch(_deletePlayer(player));
    history.push("/players");
  };
};


const initialState = [];
export default function playersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYERS:
      return action.player;
      case CREATE_PLAYER:
        return [...state, action.player];
        case DELETE_PLAYER:
      return state.filter((player) => player.id !== action.player.id)
      ;
      default:
        return state;
    }
  }
