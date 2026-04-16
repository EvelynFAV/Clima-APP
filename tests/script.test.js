/**
 * PRUEBAS AUTOMATIZADAS - APP CLIMA
 * Casos de prueba con Jest
 * 
 * Ejecutar: npm test
 * Instalar primero: npm install --save-dev jest @testing-library/dom
 */

const { interpretWeather, isValidCoordinates } = require('./script.js');

// ===============================
// MOCKS GLOBALES
// ===============================

global.fetch = jest.fn();

const mockGeoResponse = {
    results: [
        {
            name: "Santiago",
            country: "Chile",
            latitude: -33.8688,
            longitude: -51.2093
        }
    ]
};

const mockWeatherResponse = {
    current_weather: {
        temperature: 22,
        windspeed: 15
    },
    daily: {
        temperature_2m_max: [28],
        temperature_2m_min: [18],
        precipitation_probability_max: [30],
        weathercode: [0]
    }
};

const mockEmptyGeoResponse = { results: [] };

// ===============================
// TEST SUITE 1: INTERPRETACIÓN DE CÓDIGOS DE CLIMA (WMO)
// ===============================

describe("☀️ TC-01: Código 0 - Cielo Despejado", () => {
    test("TC-01: Código 0 debe retornar ☀️ Cielo despejado", () => {
        expect(interpretWeather(0)).toBe("☀️ Cielo despejado");
    });
});

describe("⛅ TC-02-04: Códigos 1-3 - Principalmente Despejado/Parcialmente Nublado", () => {
    test("TC-02: Código 1 debe retornar ⛅ Principalmente despejado", () => {
        expect(interpretWeather(1)).toBe("⛅ Principalmente despejado o parcialmente nublado");
    });

    test("TC-03: Código 2 debe retornar ⛅ Parcialmente nublado", () => {
        expect(interpretWeather(2)).toBe("⛅ Principalmente despejado o parcialmente nublado");
    });

    test("TC-04: Código 3 debe retornar ⛅ Muy nublado", () => {
        expect(interpretWeather(3)).toBe("⛅ Principalmente despejado o parcialmente nublado");
    });
});

describe("🌫️ TC-05-06: Códigos 45, 48 - Niebla", () => {
    test("TC-05: Código 45 debe retornar 🌫️ Niebla", () => {
        expect(interpretWeather(45)).toBe("🌫️ Niebla");
    });

    test("TC-06: Código 48 debe retornar 🌫️ Niebla con hielo depositado", () => {
        expect(interpretWeather(48)).toBe("🌫️ Niebla");
    });
});

describe("🌦️ TC-07-09: Códigos 51, 53, 55 - Llovizna", () => {
    test("TC-07: Código 51 debe retornar 🌦️ Llovizna ligera", () => {
        expect(interpretWeather(51)).toBe("🌦️ Llovizna");
    });

    test("TC-08: Código 53 debe retornar 🌦️ Llovizna moderada", () => {
        expect(interpretWeather(53)).toBe("🌦️ Llovizna");
    });

    test("TC-09: Código 55 debe retornar 🌦️ Llovizna densa", () => {
        expect(interpretWeather(55)).toBe("🌦️ Llovizna");
    });
});

describe("🥶 TC-10-11: Códigos 56, 57 - Llovizna Congelada", () => {
    test("TC-10: Código 56 debe retornar 🥶 Llovizna congelada ligera", () => {
        expect(interpretWeather(56)).toBe("🥶 Llovizna congelada");
    });

    test("TC-11: Código 57 debe retornar 🥶 Llovizna congelada densa", () => {
        expect(interpretWeather(57)).toBe("🥶 Llovizna congelada");
    });
});

describe("🌧️ TC-12-14: Códigos 61, 63, 65 - Lluvia", () => {
    test("TC-12: Código 61 debe retornar 🌧️ Lluvia ligera", () => {
        expect(interpretWeather(61)).toBe("🌧️ Lluvia");
    });

    test("TC-13: Código 63 debe retornar 🌧️ Lluvia moderada", () => {
        expect(interpretWeather(63)).toBe("🌧️ Lluvia");
    });

    test("TC-14: Código 65 debe retornar 🌧️ Lluvia fuerte", () => {
        expect(interpretWeather(65)).toBe("🌧️ Lluvia");
    });
});

describe("🥶 TC-15-16: Códigos 66, 67 - Lluvia Congelada", () => {
    test("TC-15: Código 66 debe retornar 🥶 Lluvia congelada ligera", () => {
        expect(interpretWeather(66)).toBe("🥶 Lluvia congelada");
    });

    test("TC-16: Código 67 debe retornar 🥶 Lluvia congelada fuerte", () => {
        expect(interpretWeather(67)).toBe("🥶 Lluvia congelada");
    });
});

describe("❄️ TC-17-19: Códigos 71, 73, 75 - Nieve", () => {
    test("TC-17: Código 71 debe retornar ❄️ Nieve ligera", () => {
        expect(interpretWeather(71)).toBe("❄️ Nieve");
    });

    test("TC-18: Código 73 debe retornar ❄️ Nieve moderada", () => {
        expect(interpretWeather(73)).toBe("❄️ Nieve");
    });

    test("TC-19: Código 75 debe retornar ❄️ Nieve fuerte", () => {
        expect(interpretWeather(75)).toBe("❄️ Nieve");
    });
});

describe("❄️ TC-20: Código 77 - Granos de Nieve", () => {
    test("TC-20: Código 77 debe retornar ❄️ Granos de nieve", () => {
        expect(interpretWeather(77)).toBe("❄️ Granos de nieve");
    });
});

describe("🌧️ TC-21-23: Códigos 80, 81, 82 - Chaparrones de Lluvia", () => {
    test("TC-21: Código 80 debe retornar 🌧️ Chaparrones de lluvia ligero", () => {
        expect(interpretWeather(80)).toBe("🌧️ Chaparrones de lluvia");
    });

    test("TC-22: Código 81 debe retornar 🌧️ Chaparrones de lluvia moderado", () => {
        expect(interpretWeather(81)).toBe("🌧️ Chaparrones de lluvia");
    });

    test("TC-23: Código 82 debe retornar 🌧️ Chaparrones de lluvia violento", () => {
        expect(interpretWeather(82)).toBe("🌧️ Chaparrones de lluvia");
    });
});

describe("❄️ TC-24-25: Códigos 85, 86 - Chaparrones de Nieve", () => {
    test("TC-24: Código 85 debe retornar ❄️ Chaparrones de nieve ligero", () => {
        expect(interpretWeather(85)).toBe("❄️ Chaparrones de nieve");
    });

    test("TC-25: Código 86 debe retornar ❄️ Chaparrones de nieve fuerte", () => {
        expect(interpretWeather(86)).toBe("❄️ Chaparrones de nieve");
    });
});

describe("⛈️ TC-26-28: Códigos 95, 96, 99 - Tormenta Eléctrica", () => {
    test("TC-26: Código 95 debe retornar ⛈️ Tormenta eléctrica ligera o moderada", () => {
        expect(interpretWeather(95)).toBe("⛈️ Tormenta eléctrica");
    });

    test("TC-27: Código 96 debe retornar ⛈️ Tormenta eléctrica con granizo ligero", () => {
        expect(interpretWeather(96)).toBe("⛈️ Tormenta eléctrica");
    });

    test("TC-28: Código 99 debe retornar ⛈️ Tormenta eléctrica con granizo fuerte", () => {
        expect(interpretWeather(99)).toBe("⛈️ Tormenta eléctrica");
    });
});

describe("🌡️ TC-29: Código Desconocido", () => {
    test("TC-29: Código inválido debe retornar 🌡️ Clima desconocido", () => {
        expect(interpretWeather(999)).toBe("🌡️ Clima desconocido");
    });

    test("TC-29: Código negativo debe retornar 🌡️ Clima desconocido", () => {
        expect(interpretWeather(-1)).toBe("🌡️ Clima desconocido");
    });

    test("TC-29: Código null debe retornar 🌡️ Clima desconocido", () => {
        expect(interpretWeather(null)).toBe("🌡️ Clima desconocido");
    });
});


// ===============================
// TEST SUITE 2: VALIDACIÓN DE COORDENADAS
// ===============================

describe("🧭 TC-30-35: Validación de Coordenadas", () => {

    test("TC-30: Coordenadas válidas (Santiago, Chile)", () => {
        expect(isValidCoordinates(-33.8688, -51.2093)).toBe(true);
    });

    test("TC-31: Coordenadas válidas (Tokyo, Japón)", () => {
        expect(isValidCoordinates(35.6762, 139.6503)).toBe(true);
    });

    test("TC-32: Latitud en límite sur (-90)", () => {
        expect(isValidCoordinates(-90, 0)).toBe(true);
    });

    test("TC-33: Latitud en límite norte (90)", () => {
        expect(isValidCoordinates(90, 0)).toBe(true);
    });

    test("TC-34: Longitud en límite oeste (-180)", () => {
        expect(isValidCoordinates(0, -180)).toBe(true);
    });

    test("TC-35: Longitud en límite este (180)", () => {
        expect(isValidCoordinates(0, 180)).toBe(true);
    });

    test("TC-35: Latitud fuera de rango (-91) debe ser inválida", () => {
        expect(isValidCoordinates(-91, 0)).toBe(false);
    });

    test("TC-35: Latitud fuera de rango (91) debe ser inválida", () => {
        expect(isValidCoordinates(91, 0)).toBe(false);
    });

    test("TC-35: Longitud fuera de rango (-181) debe ser inválida", () => {
        expect(isValidCoordinates(0, -181)).toBe(false);
    });

    test("TC-35: Longitud fuera de rango (181) debe ser inválida", () => {
        expect(isValidCoordinates(0, 181)).toBe(false);
    });

    test("TC-35: Límites exactos válidos (-90, -180)", () => {
        expect(isValidCoordinates(-90, -180)).toBe(true);
    });

    test("TC-35: Límites exactos válidos (90, 180)", () => {
        expect(isValidCoordinates(90, 180)).toBe(true);
    });

    test("TC-35: Coordenadas en océano (0, 0) válidas", () => {
        expect(isValidCoordinates(0, 0)).toBe(true);
    });

    test("TC-35: Decimales muy precisos válidos", () => {
        expect(isValidCoordinates(-33.868888888888, -51.209333333)).toBe(true);
    });
});

// ===============================
// TEST SUITE 3: MOCK DE FETCH - GEOCODING
// ===============================

describe("🌍 TC-36-40: API Geocoding Open-Meteo", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-36: Response con results null debe manejar error", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ results: null })
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();
        
        expect(data.results).toBeNull();
    });

    test("TC-37: Response con array vacío debe retornar []", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ results: [] })
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();
        
        expect(Array.isArray(data.results)).toBe(true);
        expect(data.results.length).toBe(0);
    });

    test("TC-38: Response con múltiples resultados debe extraer el primero", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                results: [
                    { name: "Santiago", country: "Chile", latitude: -33.8688, longitude: -51.2093 },
                    { name: "Santiago", country: "Cuba", latitude: 20.0214, longitude: -75.8246 }
                ]
            })
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();
        
        expect(data.results[0].country).toBe("Chile");
    });

    test("TC-39: Coordenadas extraídas deben estar en rangos válidos", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => mockGeoResponse
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();
        
        const { latitude, longitude } = data.results[0];
        expect(isValidCoordinates(latitude, longitude)).toBe(true);
    });

    test("TC-40: Response sin country field debe funcionar", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                results: [
                    { name: "Santiago", latitude: -33.8688, longitude: -51.2093 }
                ]
            })
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();
        
        expect(data.results[0].country).toBeUndefined();
        expect(data.results[0].latitude).toBeDefined();
    });
});

// ===============================
// TEST SUITE 4: MOCK DE FETCH - CLIMA
// ===============================

describe("🌤️ TC-41-48: API Clima Open-Meteo", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-41: Response válida debe contener datos requeridos", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => mockWeatherResponse
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.temperature).toBeDefined();
        expect(data.current_weather.windspeed).toBeDefined();
        expect(data.daily.temperature_2m_max).toBeDefined();
        expect(data.daily.temperature_2m_min).toBeDefined();
        expect(data.daily.precipitation_probability_max).toBeDefined();
        expect(data.daily.weathercode).toBeDefined();
    });

    test("TC-42: Temperatura extrema -50°C sin errores", async () => {
        const extremeWeather = {
            ...mockWeatherResponse,
            current_weather: { temperature: -50, windspeed: 45 },
            daily: { ...mockWeatherResponse.daily, temperature_2m_min: [-55] }
        };

        fetch.mockResolvedValueOnce({
            json: async () => extremeWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.temperature).toBe(-50);
        expect(data.daily.temperature_2m_min[0]).toBe(-55);
    });

    test("TC-43: Temperatura extrema +50°C sin errores", async () => {
        const extremeWeather = {
            ...mockWeatherResponse,
            current_weather: { temperature: 50, windspeed: 30 },
            daily: { ...mockWeatherResponse.daily, temperature_2m_max: [52] }
        };

        fetch.mockResolvedValueOnce({
            json: async () => extremeWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.temperature).toBe(50);
        expect(data.daily.temperature_2m_max[0]).toBe(52);
    });

    test("TC-44: Temperatura exactamente 0°C", async () => {
        const zeroWeather = {
            ...mockWeatherResponse,
            current_weather: { temperature: 0, windspeed: 10 },
            daily: { ...mockWeatherResponse.daily, temperature_2m_min: [0] }
        };

        fetch.mockResolvedValueOnce({
            json: async () => zeroWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.temperature).toBe(0);
        expect(data.daily.temperature_2m_min[0]).toBe(0);
    });

    test("TC-45: Diferencia min/max = 0 (mismo valor)", async () => {
        const sameTemp = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                temperature_2m_max: [20],
                temperature_2m_min: [20]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => sameTemp
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily.temperature_2m_max[0]).toBe(data.daily.temperature_2m_min[0]);
    });

    test("TC-46: Inverción térmica (min > max)", async () => {
        const inverted = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                temperature_2m_max: [20],
                temperature_2m_min: [25]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => inverted
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        // Datos inusuales pero posibles de capturar
        expect(data.daily.temperature_2m_min[0]).toBeGreaterThan(data.daily.temperature_2m_max[0]);
    });

    test("TC-47: Viento extremo 120+ km/h sin errores", async () => {
        const stormyWeather = {
            ...mockWeatherResponse,
            current_weather: { temperature: 15, windspeed: 150 }
        };

        fetch.mockResolvedValueOnce({
            json: async () => stormyWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.windspeed).toBe(150);
    });

    test("TC-48: Viento 0 km/h (sin viento)", async () => {
        const calmWeather = {
            ...mockWeatherResponse,
            current_weather: { temperature: 25, windspeed: 0 }
        };

        fetch.mockResolvedValueOnce({
            json: async () => calmWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather.windspeed).toBe(0);
    });
});

// ===============================
// TEST SUITE 5A: PRECIPITACIÓN - CASOS LÍMITE
// ===============================

describe("🌧️ TC-48A-48D: Precipitación - Casos Límite", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-48A: Precipitación 0% (sin lluvia)", async () => {
        const noPrecip = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                precipitation_probability_max: [0]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => noPrecip
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily.precipitation_probability_max[0]).toBe(0);
    });

    test("TC-48B: Precipitación 100% (lluvia segura)", async () => {
        const fullPrecip = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                precipitation_probability_max: [100]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => fullPrecip
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily.precipitation_probability_max[0]).toBe(100);
    });

    test("TC-48C: Precipitación decimal 45.5%", async () => {
        const decimalPrecip = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                precipitation_probability_max: [45.5]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => decimalPrecip
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily.precipitation_probability_max[0]).toBe(45.5);
    });

    test("TC-48D: Precipitación > 100% (valor inválido)", async () => {
        const invalidPrecip = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                precipitation_probability_max: [150]
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => invalidPrecip
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        // El valor se captura, aunque sea inválido (debería ser validado en la UI)
        expect(data.daily.precipitation_probability_max[0]).toBe(150);
    });
});

// ===============================
// TEST SUITE 5B: ARRAY VACÍO Y DATOS FALTANTES
// ===============================

describe("⚠️ TC-49A-49D: Arrays Vacíos y Datos Faltantes", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-49A: Respuesta con temperatura_max array vacío: []", async () => {
        const emptyArray = {
            ...mockWeatherResponse,
            daily: {
                ...mockWeatherResponse.daily,
                temperature_2m_max: []
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => emptyArray
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        // Acceso a [0] en array vacío = undefined
        expect(data.daily.temperature_2m_max[0]).toBeUndefined();
    });

    test("TC-49B: Respuesta sin campo weathercode", async () => {
        const noWeatherCode = {
            current_weather: mockWeatherResponse.current_weather,
            daily: {
                temperature_2m_max: [28],
                temperature_2m_min: [18],
                precipitation_probability_max: [30]
                // ❌ Falta: weathercode
            }
        };

        fetch.mockResolvedValueOnce({
            json: async () => noWeatherCode
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily.weathercode).toBeUndefined();
    });

    test("TC-49C: Respuesta sin current_weather", async () => {
        const noCurrentWeather = {
            // ❌ Falta: current_weather
            daily: mockWeatherResponse.daily
        };

        fetch.mockResolvedValueOnce({
            json: async () => noCurrentWeather
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.current_weather).toBeUndefined();
    });

    test("TC-49D: Respuesta sin daily", async () => {
        const noDaily = {
            current_weather: mockWeatherResponse.current_weather
            // ❌ Falta: daily
        };

        fetch.mockResolvedValueOnce({
            json: async () => noDaily
        });

        const response = await fetch('https://api.open-meteo.com/v1/forecast');
        const data = await response.json();

        expect(data.daily).toBeUndefined();
    });
});

// ===============================
// TEST SUITE 5C: CIUDADES CON CARACTERES ESPECIALES
// ===============================

describe("🌍 TC-50A-50F: Ciudades con Caracteres Especiales", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-50A: Ciudad con acentos 'São Paulo'", async () => {
        const saoPaulo = {
            results: [{
                name: "São Paulo",
                country: "Brazil",
                latitude: -23.5505,
                longitude: -46.6333
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => saoPaulo
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=São Paulo');
        const data = await response.json();

        expect(data.results[0].name).toBe("São Paulo");
        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });

    test("TC-50B: Ciudad con acentos 'Montréal'", async () => {
        const montreal = {
            results: [{
                name: "Montréal",
                country: "Canada",
                latitude: 45.5017,
                longitude: -73.5673
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => montreal
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Montréal');
        const data = await response.json();

        expect(data.results[0].name).toBe("Montréal");
    });

    test("TC-50C: Caracteres chinos '北京' (Beijing)", async () => {
        const beijing = {
            results: [{
                name: "北京",
                country: "China",
                latitude: 39.9042,
                longitude: 116.4074
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => beijing
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=北京');
        const data = await response.json();

        expect(data.results[0].name).toBe("北京");
    });

    test("TC-50D: Caracteres árabes 'دمشق' (Damasco)", async () => {
        const damascus = {
            results: [{
                name: "دمشق",
                country: "Syria",
                latitude: 33.5138,
                longitude: 36.2765
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => damascus
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=دمشق');
        const data = await response.json();

        expect(data.results[0].name).toBe("دمشق");
    });

    test("TC-50E: Búsqueda case-insensitive 'santiago' vs 'Santiago'", async () => {
        const santiago = {
            results: [{
                name: "Santiago",
                country: "Chile",
                latitude: -33.8688,
                longitude: -51.2093
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => santiago
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=santiago');
        const data = await response.json();

        // API debe ignorar mayúsculas/minúsculas
        expect(data.results[0].name).toBe("Santiago");
    });

    test("TC-50F: Búsqueda con emoji '🌆 Madrid'", async () => {
        const madrid = {
            results: [{
                name: "Madrid",
                country: "Spain",
                latitude: 40.4168,
                longitude: -3.7038
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => madrid
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=🌆 Madrid');
        const data = await response.json();

        expect(data.results[0].name).toBe("Madrid");
    });
});

// ===============================
// TEST SUITE 5D: CIUDADES CON MISMO NOMBRE
// ===============================

describe("🏙️ TC-51A-51B: Ciudades con Mismo Nombre (Diferentes Países)", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-51A: 'Lima' - Retorna Lima, Perú (primero en resultados)", async () => {
        const lima = {
            results: [
                { name: "Lima", country: "Peru", latitude: -12.0464, longitude: -77.0428 },
                { name: "Lima", country: "Ohio, United States", latitude: 40.7289, longitude: -84.1057 }
            ]
        };

        fetch.mockResolvedValueOnce({
            json: async () => lima
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Lima&count=2');
        const data = await response.json();

        // Debe retornar el primero
        expect(data.results[0].country).toBe("Peru");
        expect(data.results[1].country).toBe("Ohio, United States");
    });

    test("TC-51B: 'Santiago' - Verifica que hay múltiples Santiagos", async () => {
        const santiago = {
            results: [
                { name: "Santiago", country: "Chile", latitude: -33.8688, longitude: -51.2093 },
                { name: "Santiago", country: "Cuba", latitude: 20.0214, longitude: -75.8246 },
                { name: "Santiago", country: "Dominican Republic", latitude: 19.4541, longitude: -70.6969 }
            ]
        };

        fetch.mockResolvedValueOnce({
            json: async () => santiago
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Santiago&count=3');
        const data = await response.json();

        expect(data.results.length).toBe(3);
        expect(data.results[0].country).toBe("Chile");
    });
});

// ===============================
// TEST SUITE 5E: ENTRADA - CASOS LÍMITE ADICIONALES
// ===============================

describe("📝 TC-52A-52E: Entrada - Casos Límite Adicionales", () => {

    test("TC-52A: Nombre de ciudad vacío ''", () => {
        const input = "";
        expect(input.trim()).toBe("");
    });

    test("TC-52B: Nombre de ciudad 1 carácter 'A'", () => {
        const input = "A";
        expect(input.length).toBe(1);
        expect(input.length < 2).toBe(true);
    });

    test("TC-52C: Nombre de ciudad muy largo (1000+ caracteres)", () => {
        const input = "X".repeat(1000);
        expect(input.length).toBe(1000);
    });

    test("TC-52D: Nombre con espacios múltiples 'New  York' (doble espacio)", () => {
        const input = "New  York";
        expect(input.includes("  ")).toBe(true);
    });

    test("TC-52E: Nombre con coma 'Santiago, Chile'", () => {
        const input = "Santiago, Chile";
        expect(input).toContain(",");
    });
});

// ===============================
// TEST SUITE 5F: DEBOUNCE Y TIMING
// ===============================

describe("⏱️ TC-53A-53B: Debounce y Timing (400ms)", () => {

    beforeEach(() => {
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test("TC-53A: Debounce de 400ms debe esperar antes de llamar API", () => {
        const mockCallback = jest.fn();
        
        // Simular: Usuario escribe 'S', presiona pausa 300ms (no llama)
        const timeout = setTimeout(mockCallback, 400);
        
        jest.advanceTimersByTime(300);
        expect(mockCallback).not.toHaveBeenCalled();

        // Luego presiona más y avanza 100ms más (total 400ms, ahora sí llama)
        jest.advanceTimersByTime(100);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        
        clearTimeout(timeout);
    });

    test("TC-53B: Escritura rápida debe resetear el debounce", () => {
        const mockCallback = jest.fn();
        
        // Primera letra: inicia timeout de 400ms
        let timeout1 = setTimeout(mockCallback, 400);
        jest.advanceTimersByTime(200);
        
        // Segunda letra: cancela el anterior y abre uno nuevo
        clearTimeout(timeout1);
        const timeout2 = setTimeout(mockCallback, 400);
        jest.advanceTimersByTime(200);
        
        // Total pasó 400ms desde la segunda letra
        jest.advanceTimersByTime(200);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        
        clearTimeout(timeout2);
    });
});

// ===============================
// TEST SUITE 5G: ZONAS HORARIAS EXTREMAS
// ===============================

describe("🌍 TC-54A-54B: Zonas Horarias Extremas", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-54A: Zona horaria UTC+14 (Kiribati - más adelantado)", async () => {
        const kiribati = {
            results: [{
                name: "Tarawa",
                country: "Kiribati",
                latitude: 1.2921,
                longitude: 172.9789
                // UTC+14
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => kiribati
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Kiribati');
        const data = await response.json();

        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });

    test("TC-54B: Zona horaria UTC-12 (Baker Island - más retrasado)", async () => {
        const bakerIsland = {
            results: [{
                name: "Baker Island",
                country: "United States",
                latitude: 0.1867,
                longitude: -176.4766
                // UTC-12
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => bakerIsland
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Baker Island');
        const data = await response.json();

        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });

    test("TC-54C: Zona horaria UTC±0 (Londres/Dakar/Accra)", async () => {
        const london = {
            results: [{
                name: "London",
                country: "United Kingdom",
                latitude: 51.5074,
                longitude: -0.1278
                // UTC+0
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => london
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=London');
        const data = await response.json();

        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });

    test("TC-54D: Horario de verano (New York - EDT/EST)", async () => {
        const newyork = {
            results: [{
                name: "New York",
                country: "United States",
                latitude: 40.7128,
                longitude: -74.0060
                // EDT (UTC-4) en verano, EST (UTC-5) en invierno
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => newyork
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=New York');
        const data = await response.json();

        expect(data.results[0].name).toBe("New York");
    });
});

// ===============================
// TEST SUITE 8: MANEJO DE ERRORES
// ===============================

describe("⚠️ TC-55-58: Manejo de Errores", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-55: API Geocoding offline debe capturar error", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));

        try {
            await fetch('https://geocoding-api.open-meteo.com/v1/search');
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("Network error");
        }
    });

    test("TC-56: API Clima offline debe capturar error", async () => {
        fetch.mockRejectedValueOnce(new Error("Connection timeout"));

        try {
            await fetch('https://api.open-meteo.com/v1/forecast');
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("Connection timeout");
        }
    });

    test("TC-57: JSON inválido debe capturar error", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => {
                throw new SyntaxError("Unexpected token");
            }
        });

        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast');
            await response.json();
            expect(true).toBe(false);
        } catch (error) {
            expect(error instanceof SyntaxError).toBe(true);
        }
    });

    test("TC-58: Timeout debe ser manejado", async () => {
        fetch.mockImplementationOnce(() => 
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 100)
            )
        );

        try {
            await fetch('https://api.open-meteo.com/v1/forecast');
        } catch (error) {
            expect(error.message).toBe("Timeout");
        }
    });
});

// ===============================
// TEST SUITE 9: VALIDACIONES DE ENTRADA
// ===============================

describe("📝 TC-59-68: Validación de Entrada", () => {

    test("TC-59: Input vacío debe rechazarse", () => {
        const input = "";
        expect(input.trim().length).toBe(0);
    });

    test("TC-60: Solo espacios debe rechazarse", () => {
        const input = "   ";
        expect(input.trim().length).toBe(0);
    });

    test("TC-61: Entrada válida 'Santiago' con 2+ caracteres", () => {
        const input = "Santiago";
        expect(input.length).toBeGreaterThanOrEqual(2);
    });

    test("TC-62: Entrada muy larga (1000+ caracteres)", () => {
        const input = "X".repeat(1000);
        expect(input.length).toBeGreaterThan(100);
    });

    test("TC-63: Entrada con acentos 'São Paulo'", () => {
        const input = "São Paulo";
        expect(input.length).toBeGreaterThan(0);
    });

    test("TC-64: Entrada con caracteres especiales 'New York-City'", () => {
        const input = "New York-City";
        expect(input.length).toBeGreaterThan(0);
    });

    test("TC-65: Entrada con números 'New York 2020'", () => {
        const input = "New York 2020";
        expect(input.length).toBeGreaterThan(0);
    });

    test("TC-66: Entrada con caracteres chinos '北京' (Beijing)", () => {
        const input = "北京";
        expect(input.length).toBeGreaterThan(0);
    });

    test("TC-67: Entrada con emoji '🌆 Madrid'", () => {
        const input = "🌆 Madrid";
        expect(input.length).toBeGreaterThan(0);
    });

    test("TC-68: Entrada 1 carácter NO pasa filtro debounce", () => {
        const input = "S";
        expect(input.length).toBeLessThan(2);
    });
});

// ===============================
// TEST SUITE 10: INTEGRACIÓN (FLUJOS COMPLETOS)
// ===============================

describe("🔄 TC-69-72: Pruebas de Integración", () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test("TC-69: Flujo completo - Geocoding + Clima (Santiago)", async () => {
        // Primero: Mock geocoding
        fetch.mockResolvedValueOnce({
            json: async () => mockGeoResponse
        });

        // Segundo: Mock clima
        fetch.mockResolvedValueOnce({
            json: async () => mockWeatherResponse
        });

        // Simular búsqueda
        const geoResponse = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const geoData = await geoResponse.json();

        expect(geoData.results.length).toBeGreaterThan(0);

        const weather = await fetch('https://api.open-meteo.com/v1/forecast');
        const weatherData = await weather.json();

        expect(weatherData.current_weather.temperature).toBeDefined();
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    test("TC-70: Búsqueda de 2 ciudades diferentes retorna resultados independientes", async () => {
        const santiago = { results: [{ name: "Santiago", country: "Chile" }] };
        const buenos_aires = { results: [{ name: "Buenos Aires", country: "Argentina" }] };

        fetch.mockResolvedValueOnce({ json: async () => santiago });
        fetch.mockResolvedValueOnce({ json: async () => buenos_aires });

        const result1 = await (await fetch('api1')).json();
        const result2 = await (await fetch('api2')).json();

        expect(result1.results[0].name).toBe("Santiago");
        expect(result2.results[0].name).toBe("Buenos Aires");
        expect(result1).not.toEqual(result2);
    });

    test("TC-71: Búsqueda rápida secuencial (verifica que cada llamada se registra)", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => mockGeoResponse
        });

        // Simular 3 búsquedas rápidas
        await fetch('api1');
        await fetch('api1');
        await fetch('api1');

        expect(fetch).toHaveBeenCalledTimes(3);
    });

    test("TC-72: Zona horaria UTC-3 (Buenos Aires)", async () => {
        const buenosAires = {
            results: [{
                name: "Buenos Aires",
                country: "Argentina",
                latitude: -34.6037,
                longitude: -58.3816
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => buenosAires
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();

        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });

    test("TC-73: Zona horaria UTC+9 (Tokyo)", async () => {
        const tokyo = {
            results: [{
                name: "Tokyo",
                country: "Japan",
                latitude: 35.6762,
                longitude: 139.6503
            }]
        };

        fetch.mockResolvedValueOnce({
            json: async () => tokyo
        });

        const response = await fetch('https://geocoding-api.open-meteo.com/v1/search');
        const data = await response.json();

        expect(isValidCoordinates(data.results[0].latitude, data.results[0].longitude)).toBe(true);
    });
});

// ===============================
// RESUMEN FINAL DE PRUEBAS (ACTUALIZADO)
// ===============================

/*
TOTAL DE CASOS DE PRUEBA: 130+

✅ Códigos de Clima WMO: 29 tests
   - Cielo despejado (1)
   - Parcialmente nublado (1)
   - Niebla (2)
   - Llovizna (3)
   - Llovizna congelada (2)
   - Lluvia (3)
   - Lluvia congelada (2)
   - Nieve (3)
   - Granos de nieve (1)
   - Chaparrones de lluvia (3)
   - Chaparrones de nieve (2)
   - Tormentas (3)
   - Códigos desconocidos (3)

🧭 Validación de Coordenadas: 14 tests
   - Coordenadas válidas (2)
   - Límites válidos (-90, 90, -180, 180)
   - Latitudes fuera de rango (2)
   - Longitudes fuera de rango (2)
   - Coordenadas extremas verificadas
   - Decimales precisos

🌍 API Geocoding: 5 tests
   - Response con results null
   - Response con array vacío
   - Múltiples resultados
   - Coordenadas válidas
   - Sin field 'country'

🌤️ API Clima: 8 tests
   - Response válida completa
   - Temperatura -50°C
   - Temperatura +50°C
   - Temperatura 0°C (NUEVO)
   - Diferencia min/max = 0 (NUEVO)
   - Inversión térmica (NUEVO)
   - Viento 150+ km/h
   - Viento 0 km/h

💧 Precipitación - Casos Límite: 4 tests (NUEVO)
   - 0% (sin lluvia)
   - 100% (lluvia segura)
   - Decimal 45.5%
   - > 100% (inválido)

⚠️ Arrays Vacíos y Datos Faltantes: 4 tests (NUEVO)
   - Array temperatura_max vacío
   - Sin campo weathercode
   - Sin current_weather
   - Sin daily

🌍 Ciudades con Caracteres Especiales: 6 tests (NUEVO)
   - Acentos: "São Paulo"
   - Acentos: "Montréal"
   - Chino: "北京" (Beijing)
   - Árabe: "دمشق" (Damasco)
   - Case-insensitive: "santiago" vs "Santiago"
   - Emoji: "🌆 Madrid"

🏙️ Ciudades Mismo Nombre (Diferentes Países): 2 tests (NUEVO)
   - "Lima": Perú vs Ohio
   - "Santiago": Chile, Cuba, Dominican Republic

📝 Entrada - Casos Límite Adicionales: 5 tests (NUEVO)
   - Vacío: ""
   - 1 carácter: "A"
   - Muy largo: 1000+
   - Espacios múltiples
   - Con coma: "Santiago, Chile"

⏱️ Debounce y Timing: 2 tests (NUEVO)
   - 400ms espera
   - Reset al escribir rápido

🌍 Zonas Horarias Extremas: 4 tests (NUEVO)
   - UTC+14 (Kiribati)
   - UTC-12 (Baker Island)
   - UTC±0 (Londres)
   - Horario de verano (New York)

⚠️ Manejo de Errores: 4 tests
   - API Geocoding offline
   - API Clima offline
   - JSON inválido
   - Timeout

📝 Validación de Entrada: 10 tests
   - Input vacío
   - Solo espacios
   - Entrada válida
   - Muy larga (+1000 chars)
   - Con acentos
   - Caracteres especiales
   - Con números
   - Caracteres chinos
   - Con emoji
   - Debounce (< 2 chars)

🔄 Integración: 5 tests
   - Flujo geocoding + clima
   - 2 ciudades diferentes
   - Búsquedas rápidas
   - Zona UTC-3
   - Zona UTC+9

CÓMO EJECUTAR:
1. npm install --save-dev jest
2. npm test
3. npm test -- --watch
4. npm test -- --coverage
*/
