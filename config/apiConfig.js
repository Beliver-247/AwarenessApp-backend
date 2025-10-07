const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "http://api.openweathermap.org/data/2.5";

module.exports = {
  API_KEY,
  BASE_URL,
};
