import { getCoordinates, getAirQuality, getHistoricalAirQuality } from "../services/airQualityService.js";


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

// New: Historical Trends
export const fetchHistoricalAirQuality = async (req, res) => {
  try {
    const { city, days } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const numDays = days ? parseInt(days) : 5; // default 5 days
    if (numDays > 5) {
      return res.status(400).json({ error: "Max supported is 5 days" });
    }

    // Step 1: Get coordinates
    const { lat, lon } = await getCoordinates(city);

    // Step 2: Calculate start & end timestamps
    const end = Math.floor(Date.now() / 1000); // current time
    const start = end - numDays * 24 * 60 * 60; // subtract N days

    // Step 3: Fetch historical air quality
    const historicalData = await getHistoricalAirQuality(lat, lon, start, end);

    // Step 4: Format results
    const trends = historicalData.list.map((entry) => ({
      timestamp: new Date(entry.dt * 1000),
      aqi: entry.main.aqi,
      components: entry.components,
    }));

    res.json({
      city,
      coordinates: { lat, lon },
      period: `${numDays} days`,
      trends,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch historical air quality" });
  }
};
