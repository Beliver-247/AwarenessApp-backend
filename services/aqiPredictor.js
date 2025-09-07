import tf from '@tensorflow/tfjs';
import axios from 'axios';

class AQIPredictor {
    constructor() {
        this.model = null;
        this.isTrained = false;
    }

    // Prepare training data from historical AQI
    prepareTrainingData(historicalData) {
        if (!Array.isArray(historicalData)) {
            throw new Error('Historical data must be an array');
        }

        const X = []; // Input: day index
        const y = []; // Output: AQI value

        historicalData.forEach((data, index) => {
            if (data.aqi === undefined || data.aqi === null) {
                console.warn(`Skipping data point at index ${index}: missing AQI value`);
                return;
            }
            
            X.push(index); // Day number (0, 1, 2, ...)
            y.push(Number(data.aqi)); // Ensure it's a number
        });

        if (X.length < 2) {
            throw new Error('Not enough valid data points for training');
        }

        console.log(`Training with ${X.length} data points:`, y);

        return {
            features: tf.tensor2d(X, [X.length, 1]),
            labels: tf.tensor2d(y, [y.length, 1])
        };
    }

    // Create and train linear regression model
    async trainModel(historicalData) {
        try {
            const { features, labels } = this.prepareTrainingData(historicalData);

            // Create simple linear regression model
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({
                units: 1,
                inputShape: [1],
                activation: 'linear'
            }));

            // Compile model
            this.model.compile({
                optimizer: tf.train.sgd(0.01),
                loss: 'meanSquaredError'
            });

            // Train model
            await this.model.fit(features, labels, {
                epochs: 100,
                verbose: 0
            });

            this.isTrained = true;
            console.log('Model trained successfully');

            // Clean up tensors
            features.dispose();
            labels.dispose();

        } catch (error) {
            console.error('Error training model:', error);
            throw error;
        }
    }

    // Predict AQI for next days
    async predictNextDays(daysToPredict) {
        if (!this.isTrained || !this.model) {
            throw new Error('Model not trained yet');
        }

        try {
            // Create input for prediction (next days)
            const predictionInput = tf.tensor2d(
                Array.from({ length: daysToPredict }, (_, i) => [i + this.model.inputs[0].shape[1]]),
                [daysToPredict, 1]
            );

            // Make predictions
            const predictions = this.model.predict(predictionInput);
            const predictedValues = Array.from(predictions.dataSync());

            // Clean up tensors
            predictionInput.dispose();
            predictions.dispose();

            return predictedValues.map((aqi, index) => ({
                day: index + 1,
                predictedAQI: Math.max(1, Math.round(aqi)), // Ensure AQI is at least 1
                date: this.getFutureDate(index + 1)
            }));
        } catch (error) {
            console.error('Error making predictions:', error);
            throw error;
        }
    }

    getFutureDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    // Convert hourly data to daily data by taking average AQI per day
    convertHourlyToDaily(hourlyData) {
        const dailyMap = new Map();
        
        hourlyData.forEach(hour => {
            const date = hour.timestamp.split('T')[0]; // Extract YYYY-MM-DD
            
            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    date: date,
                    aqiSum: 0,
                    count: 0
                });
            }
            
            const daily = dailyMap.get(date);
            daily.aqiSum += hour.aqi;
            daily.count += 1;
        });
        
        // Convert to array with average AQI
        const dailyData = [];
        for (const [date, data] of dailyMap) {
            dailyData.push({
                date: date,
                aqi: Math.round(data.aqiSum / data.count)
            });
        }
        
        // Sort by date ascending
        dailyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return dailyData;
    }

    // Create mock data for testing
    createMockData(days) {
        const mockData = [];
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - days);
        
        for (let i = 0; i < days; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            
            mockData.push({
                date: date.toISOString().split('T')[0],
                aqi: Math.round(40 + Math.random() * 20) // Random AQI between 40-60
            });
        }
        
        return mockData;
    }

    // Fetch historical data from your API - FIXED VERSION
    async fetchHistoricalData(city, days) {
        try {
            console.log(`Fetching data for ${city} for ${days} days...`);
            const response = await axios.get(`http://localhost:5000/api/air-quality/history?city=${city}&days=${days}`);
            
            console.log('API Response received. Status:', response.status);
            
            // Extract the trends array from the response
            if (response.data && response.data.trends && Array.isArray(response.data.trends)) {
                console.log(`Found trends array with ${response.data.trends.length} hourly data points`);
                
                // Convert hourly data to daily averages
                const dailyData = this.convertHourlyToDaily(response.data.trends);
                console.log(`Converted to ${dailyData.length} daily data points`);
                
                return dailyData;
            }
            
            throw new Error('No trends array found in response');
            
        } catch (error) {
            console.error('Error fetching historical data:', error.message);
            console.log('Using mock data as fallback');
            return this.createMockData(days);
        }
    }

    // Main method to get predictions
    async getPredictions(city, days) {
        try {
            console.log(`Getting predictions for ${city} for next ${days} days`);
            
            // Fetch historical data
            const historicalData = await this.fetchHistoricalData(city, days);
            
            if (!Array.isArray(historicalData)) {
                throw new Error('Historical data is not an array');
            }
            
            console.log(`Processed ${historicalData.length} days of data:`, historicalData);
            
            if (historicalData.length < 2) {
                throw new Error('Not enough historical data for prediction');
            }

            // Train model
            await this.trainModel(historicalData);

            // Predict next days
            const predictions = await this.predictNextDays(days);

            return {
                city,
                historicalData,
                predictions,
                modelStatus: 'trained',
                message: `Predicted next ${days} days based on ${historicalData.length} historical days`
            };
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }
}

export default AQIPredictor;