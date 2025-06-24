const Weather = require('../Database/Models/weatherSchema');

const city = new Set([
  'New delhi',
  'Srinagar',
  'Goa',
  'Mumbai',
  'Nainital'
]);

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const fetchWeather = async () => {
  try {
    const cityArray = Array.from(city);

    const response = await Promise.all(
      cityArray.map(async (c) => {
        try {
          const existingData = await Weather.findOne({ city: c });

          const now = Date.now();
          const isFresh = existingData && (now - new Date(existingData.updatedAt).getTime()) < ONE_DAY_MS;

          if (isFresh) {
            // Return cached DB result
            return {
              city: existingData.city,
              temperature: existingData.temperature,
              description: existingData.description
            };
          }
          // Fetch from API since data is old or not found
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c)}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`
          );

          if (res.ok) {
            const data = await res.json();

            // Upsert into DB
            const updated = await Weather.findOneAndUpdate(
              { city: c },
              {
                temperature: data.main.temp,
                description: data.weather[0].description,
                updatedAt: new Date()
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            return {
              city: updated.city,
              temperature: updated.temperature,
              description: updated.description
            };
          } else {
            console.error(`Failed to fetch weather for ${c}:`, res.statusText);
            return null;
          }
        } catch (err) {
          console.error(`Error processing ${c}:`, err);
          return null;
        }
      })
    );

    return response.filter(Boolean);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    return null;
  }
};

module.exports = fetchWeather;
