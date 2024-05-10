import Axios from "axios";

const SET_CHARACTERS ="SET_CHARACTERS"
const CREATE_CHARACTER = "CREATE_CHARACTER"
const DELETE_CHARACTER = "DELETE_CHARACTER"


export const setCharacters = (character) =>{
  return{
    type: SET_CHARACTERS,
    character
  }
};

const _createCharacter = (character) => {
  return {
    type: CREATE_CHARACTER,
    character,
  };
};

const _deleteCharacter = (character) => {
  return {
    type: DELETE_CHARACTER,
    character
  };
};

export const fetchCharacters = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/characters");
        dispatch(setCharacters(data));
  };
};

export const createCharacter = (character) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/characters", character);
    dispatch(_createCharacter(created));
    // history.push("/characters");
  };
};

export const deleteCharacter = (id, history) => {
  return async (dispatch) => {
    const { data: character } = await Axios.delete(`/api/characters/${id}`);
    dispatch(_deleteCharacter(character));
    history.push("/characters");
  };
};


const initialState = [];
export default function charactersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHARACTERS:
      return action.character;
      case CREATE_CHARACTER:
        return [...state, action.character];
        case DELETE_CHARACTER:
      return state.filter((character) => character.id !== action.character.id)
      ;
      default:
        return state;
    }
  }
