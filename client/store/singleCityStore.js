import axios from "axios";

// Action Types
const SET_SINGLE_CITY = "SET_SINGLE_CITY";
const UPDATE_SINGLE_CITY = "UPDATE_SINGLE_CITY";
const TOKEN = "token";

// Action creators
export const _setSingleCity= (citydata) => {
  return {
    type: SET_SINGLE_CITY,
    citydata,
  };
};

const _updateSingleCity = (citydata) => {
  return {
    type: UPDATE_SINGLE_CITY,
    citydata,
  };
};

//Thunks
export const fetchCity = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/cities/${id}`);
    dispatch(_setSingleCity(data));
  };
};

export const updateSingleCity = (city) => {
  return async (dispatch) => {
    try {
      console.log("HERE!!", city)
        await axios.put(`/api/cities/${city.id}`, city);
        const { data: cityData } = await axios.get(`/api/cities/${city.id}`);
        dispatch(_updateSingleCity(cityData));
        // history.push(`/cities/${city.id}`)
      }
     catch (error) {
      console.error("Failed to update city:", error);
    }
  };
};

// reducer
const initialCity = [];
const singleCityReducer = (city = initialCity, action) => {
  switch (action.type) {
    case SET_SINGLE_CITY:
      return action.citydata;
    case UPDATE_SINGLE_CITY:
      return action.citydata;
    default:
      return city;
  }
};

export default singleCityReducer;
