import axios from "axios";
import { API_KEY, BASE_URL } from "../config/apiConfig.js";

// Get latitude & longitude from city name
export const getCoordinates = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
  const response = await axios.get(url);
  const { lon, lat } = response.data.coord;
  return { lat, lon };
};

// Get air quality by coordinates
export const getAirQuality = async (lat, lon) => {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};
