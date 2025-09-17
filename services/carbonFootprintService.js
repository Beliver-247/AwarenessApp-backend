// CarbonFootprintService.js
// Simple carbon footprint calculation based on user input
// Supported activities: transportation (car, bus, train), electricity usage

export function calculateCarbonFootprint({ transportation, electricity }) {
  let total = 0;

  // Transportation emissions (kg CO2e)
  if (transportation) {
    // Example: car: km * 0.21, bus: km * 0.1, train: km * 0.05
    if (transportation.carKm) total += transportation.carKm * 0.21;
    if (transportation.busKm) total += transportation.busKm * 0.1;
    if (transportation.trainKm) total += transportation.trainKm * 0.05;
  }

  // Electricity emissions (kg CO2e)
  if (electricity) {
    // Example: kWh * 0.5
    total += electricity.kwh * 0.5;
  }

  return total;
}
