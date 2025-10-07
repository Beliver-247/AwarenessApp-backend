const axios = require("axios");
const { API_KEY, BASE_URL } = require("../config/apiConfig.js");

// @desc    Get latitude & longitude from city name
const getCoordinates = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
  const response = await axios.get(url);
  const { lon, lat } = response.data.coord;
  return { lat, lon };
};

// @desc    Get current air quality by coordinates
const getAirQuality = async (lat, lon) => {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// @desc    Get historical air quality (last N days)
const getHistoricalAirQuality = async (lat, lon, start, end) => {
  const url = `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

module.exports = {
  getCoordinates,
  getAirQuality,
  getHistoricalAirQuality,
};
