import Axios from "axios";

const SET_CITIES ="SET_CITIES"
const CREATE_CITY = "CREATE_CITY"
const DELETE_CITY = "DELETE_CITY"


export const setCities = (city) =>{
  return{
    type: SET_CITIES,
    city
  }
};

const _createCity = (city) => {
  return {
    type: CREATE_CITY,
    city,
  };
};

const _deleteCity = (city) => {
  return {
    type: DELETE_CITY,
    city
  };
};

export const fetchCities = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/cities");
        dispatch(setCities(data));
  };
};

export const createCity = (city) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/cities", city);
    dispatch(_createCity(created));
    // history.push("/cities");
  };
};

export const deleteCity = (id, history) => {
  return async (dispatch) => {
    const { data: city } = await Axios.delete(`/api/cities/${id}`);
    dispatch(_deleteCity(city));
    history.push("/cities");
  };
};


const initialState = [];
export default function citiesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CITIES:
      return action.city;
      case CREATE_CITY:
        return [...state, action.city];
        case DELETE_CITY:
      return state.filter((city) => city.id !== action.city.id)
      ;
      default:
        return state;
    }
  }
