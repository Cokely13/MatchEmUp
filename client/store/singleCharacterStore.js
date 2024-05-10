import axios from "axios";

// Action Types
const SET_SINGLE_CHARACTER = "SET_SINGLE_CHARACTER";
const UPDATE_SINGLE_CHARACTER = "UPDATE_SINGLE_CHARACTER";
const TOKEN = "token";

// Action creators
export const _setSingleCharacter= (characterdata) => {
  return {
    type: SET_SINGLE_CHARACTER,
    characterdata,
  };
};

const _updateSingleCharacter = (characterdata) => {
  return {
    type: UPDATE_SINGLE_CHARACTER,
    characterdata,
  };
};

//Thunks
export const fetchCharacter = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/characters/${id}`);
    dispatch(_setSingleCharacter(data));
  };
};

export const updateSingleCharacter = (character, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/characters/${character.id}`, character);
        const { data: characterData } = await axios.get(`/api/characters/${character.id}`);
        dispatch(_updateSingleCharacter(characterData));
        history.push(`/characters/${character.id}`)
      }
     catch (error) {
      console.log("CHARACTER", character)
    }
  };
};

// reducer
const initialState = [];
const singleCharacterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_CHARACTER:
      return action.characterdata;
    case UPDATE_SINGLE_CHARACTER:
      return action.characterdata;
    default:
      return state;
  }
};

export default singleCharacterReducer;
