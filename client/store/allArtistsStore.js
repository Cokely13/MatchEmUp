import Axios from "axios";

const SET_ARTISTS ="SET_ARTISTS"
const CREATE_ARTIST = "CREATE_ARTIST"
const DELETE_ARTIST = "DELETE_ARTIST"


export const setArtists = (artist) =>{
  return{
    type: SET_ARTISTS,
    artist
  }
};

const _createArtist = (artist) => {
  return {
    type: CREATE_ARTIST,
    artist,
  };
};

const _deleteArtist = (artist) => {
  return {
    type: DELETE_ARTIST,
    artist
  };
};

export const fetchArtists = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/artists");
        dispatch(setArtists(data));
  };
};

export const createArtist = (artist) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/artists", artist);
    dispatch(_createArtist(created));
    // history.push("/artists");
  };
};

export const deleteArtist = (id, history) => {
  return async (dispatch) => {
    const { data: artist } = await Axios.delete(`/api/artists/${id}`);
    dispatch(_deleteArtist(artist));
    history.push("/artists");
  };
};


const initialState = [];
export default function artistsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ARTISTS:
      return action.artist;
      case CREATE_ARTIST:
        return [...state, action.artist];
        case DELETE_ARTIST:
      return state.filter((artist) => artist.id !== action.artist.id)
      ;
      default:
        return state;
    }
  }
