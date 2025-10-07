const Multiplier = require("../models/Multiplier.js");

// @desc    Calculate carbon footprint using given transportation and electricity data
const calculateCarbonFootprint = ({ transportation, electricity, multipliers }) => {
  let total = 0;

  // Use provided multipliers or defaults
  const m =
    multipliers || {
      carKm: 0.21,
      vanKm: 0.25,
      busKm: 0.1,
      trainKm: 0.05,
      kwh: 0.5,
    };

  // Defensive checks
  if (transportation && typeof transportation === "object") {
    if (typeof transportation.carKm === "number") total += transportation.carKm * m.carKm;
    if (typeof transportation.vanKm === "number") total += transportation.vanKm * m.vanKm;
    if (typeof transportation.busKm === "number") total += transportation.busKm * m.busKm;
    if (typeof transportation.trainKm === "number") total += transportation.trainKm * m.trainKm;
  }

  if (electricity && typeof electricity === "object" && typeof electricity.kwh === "number") {
    total += electricity.kwh * m.kwh;
  }

  // Validate and determine level
  if (typeof total !== "number" || isNaN(total)) total = 0;

  let level = "low";
  if (total > 50) level = "high";
  else if (total > 20) level = "middle";

  return { total, level, multipliers: m };
};

// @desc    Retrieve emission multipliers from the database
const getMultipliersFromDB = async () => {
  const docs = await Multiplier.find({});
  const multipliers = {};

  docs.forEach((doc) => {
    multipliers[doc.key] = doc.value;
  });

  // Fallback defaults if DB missing values
  return {
    carKm: multipliers.carKm ?? 0.21,
    vanKm: multipliers.vanKm ?? 0.25,
    busKm: multipliers.busKm ?? 0.1,
    trainKm: multipliers.trainKm ?? 0.05,
    kwh: multipliers.kwh ?? 0.5,
  };
};

// @desc    Async version — calculates footprint using dynamic multipliers from DB
const calculateCarbonFootprintAsync = async ({ transportation, electricity }) => {
  const m = await getMultipliersFromDB();
  let total = 0;

  if (transportation && typeof transportation === "object") {
    if (typeof transportation.carKm === "number") total += transportation.carKm * m.carKm;
    if (typeof transportation.vanKm === "number") total += transportation.vanKm * m.vanKm;
    if (typeof transportation.busKm === "number") total += transportation.busKm * m.busKm;
    if (typeof transportation.trainKm === "number") total += transportation.trainKm * m.trainKm;
  }

  if (electricity && typeof electricity === "object" && typeof electricity.kwh === "number") {
    total += electricity.kwh * m.kwh;
  }

  if (typeof total !== "number" || isNaN(total)) total = 0;

  let level = "low";
  if (total > 50) level = "high";
  else if (total > 20) level = "middle";

  return { total, level, multipliers: m };
};

module.exports = {
  calculateCarbonFootprint,
  getMultipliersFromDB,
  calculateCarbonFootprintAsync,
};
