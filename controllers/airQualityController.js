import { getCoordinates, getAirQuality } from "../services/airQualityService.js";

export const fetchAirQuality = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    // Step 1: Get coordinates
    const { lat, lon } = await getCoordinates(city);

    // Step 2: Get air quality
    const airQualityData = await getAirQuality(lat, lon);

    // Step 3: Extract AQI value
    const aqi = airQualityData.list[0].main.aqi;
    const interpretation = {
      1: "Good 😀",
      2: "Fair 🙂",
      3: "Moderate 😐",
      4: "Poor 😷",
      5: "Very Poor 🤢",
    };

    res.json({
      city,
      coordinates: { lat, lon },
      aqi,
      meaning: interpretation[aqi],
      components: airQualityData.list[0].components,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch air quality" });
  }
};
