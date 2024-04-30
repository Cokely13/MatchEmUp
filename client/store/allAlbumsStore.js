import Axios from "axios";

const SET_ALBUMS ="SET_ALBUMS"
const CREATE_ALBUM = "CREATE_ALBUM"
const DELETE_ALBUM = "DELETE_ALBUM"


export const setAlbums = (album) =>{
  return{
    type: SET_ALBUMS,
    album
  }
};

const _createAlbum = (album) => {
  return {
    type: CREATE_ALBUM,
    album,
  };
};

const _deleteAlbum = (album) => {
  return {
    type: DELETE_ALBUM,
    album
  };
};

export const fetchAlbums = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/albums");
        dispatch(setAlbums(data));
  };
};

export const createAlbum = (album) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/albums", album);
    dispatch(_createAlbum(created));
    // history.push("/albums");
  };
};

export const deleteAlbum = (id, history) => {
  return async (dispatch) => {
    const { data: album } = await Axios.delete(`/api/albums/${id}`);
    dispatch(_deleteAlbum(album));
    history.push("/albums");
  };
};


const initialState = [];
export default function albumsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ALBUMS:
      return action.album;
      case CREATE_ALBUM:
        return [...state, action.album];
        case DELETE_ALBUM:
      return state.filter((album) => album.id !== action.album.id)
      ;
      default:
        return state;
    }
  }
