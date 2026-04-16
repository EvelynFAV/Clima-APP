/**
 * ========================================
 * APP CLIMA GPT - SCRIPT REFACTORIZADO
 * ========================================
 * 
 * Estructura:
 * 1. CONFIGURACIÓN GLOBAL Y CONSTANTES
 * 2. FUNCIONES LÓGICAS (Core Logic)
 * 3. FUNCIONES PARA MANEJAR ERRORES (Error Handling)
 * 4. FUNCIONES RESPECTO AL DISEÑO (UI & Theme)
 * 5. INICIALIZACIÓN
 * 6. EXPORTACIÓN PARA TESTING
 */

// =========================================
// 1. CONFIGURACIÓN GLOBAL Y CONSTANTES
// =========================================

/**
 * Mapa de códigos WMO a descripciones de clima
 * Reemplaza 13 condicionales por búsqueda directa en objeto (O(1))
 * 
 * Referencia WMO: https://www.noaa.gov/education/weather-phenomena/weather-codes
 */
const WEATHER_MAP = {
    0: '☀️ Cielo despejado',
    1: '⛅ Principalmente despejado o parcialmente nublado',
    2: '⛅ Principalmente despejado o parcialmente nublado',
    3: '⛅ Principalmente despejado o parcialmente nublado',
    45: '🌫️ Niebla',
    48: '🌫️ Niebla',
    51: '🌦️ Llovizna',
    53: '🌦️ Llovizna',
    55: '🌦️ Llovizna',
    56: '🥶 Llovizna congelada',
    57: '🥶 Llovizna congelada',
    61: '🌧️ Lluvia',
    63: '🌧️ Lluvia',
    65: '🌧️ Lluvia',
    66: '🥶 Lluvia congelada',
    67: '🥶 Lluvia congelada',
    71: '❄️ Nieve',
    73: '❄️ Nieve',
    75: '❄️ Nieve',
    77: '❄️ Granos de nieve',
    80: '🌧️ Chaparrones de lluvia',
    81: '🌧️ Chaparrones de lluvia',
    82: '🌧️ Chaparrones de lluvia',
    85: '❄️ Chaparrones de nieve',
    86: '❄️ Chaparrones de nieve',
    95: '⛈️ Tormenta eléctrica',
    96: '⛈️ Tormenta eléctrica',
    99: '⛈️ Tormenta eléctrica'
};

/**
 * Reglas para generar alertas meteorológicas
 * Cada regla se evalúa secuencialmente, primera coincidencia gana
 */
const ALERT_RULES = [
    {
        name: 'Tormenta extrema',
        condition: (code, wind, rain) => code >= 95,
        message: '⚡ ALERTA: Tormenta eléctrica detectada',
        level: 'danger'
    },
    {
        name: 'Precipitación extrema',
        condition: (code, wind, rain) => code >= 85,
        message: '❄️ ALERTA: Precipitación extrema',
        level: 'warning'
    },
    {
        name: 'Vendaval',
        condition: (code, wind, rain) => wind > 80,
        message: '💨 ALERTA: Vientos muy fuertes (posible vendaval)',
        level: 'danger'
    },
    {
        name: 'Vientos fuertes',
        condition: (code, wind, rain) => wind > 60,
        message: '🌪️ PRECAUCIÓN: Vientos moderados a fuertes',
        level: 'warning'
    },
    {
        name: 'Lluvia intensa',
        condition: (code, wind, rain) => rain >= 90 && [61, 63, 65].includes(code),
        message: '🌧️ AVISO: Lluvia intensa esperada',
        level: 'warning'
    }
];

/**
 * URLs base de APIs externas
 * Centralizar para fácil mantenimiento
 */
const API_ENDPOINTS = {
    geocoding: 'https://geocoding-api.open-meteo.com/v1/search',
    weather: 'https://api.open-meteo.com/v1/forecast'
};

/**
 * Configuración de tema (colores)
 */
const THEME_CONFIG = {
    light: {
        bgColor: '#e0f7f7',
        theme: 'light'
    },
    dark: {
        bgColor: '#1a1a1a',
        theme: 'dark'
    }
};

// Variables globales
let timeout = null; // Para debounce
let currentTheme = localStorage.getItem('theme') || 'light'; // Tema activo
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; // Historial

// =========================================
// 2. FUNCIONES LÓGICAS (CORE LOGIC)
// =========================================

/**
 * Interpreta un código de clima WMO a descripción legible
 * 
 * @param {number} code - Código WMO (0-99)
 * @returns {string} Descripción con emoji (ej: "☀️ Cielo despejado")
 * 
 * @example
 * interpretWeather(0)    // Retorna: "☀️ Cielo despejado"
 * interpretWeather(95)   // Retorna: "⛈️ Tormenta eléctrica"
 * interpretWeather(999)  // Retorna: "🌡️ Clima desconocido"
 */
function interpretWeather(code) {
    // Validar que el código sea un número válido (no string, null, NaN, etc)
    if (typeof code !== 'number' || isNaN(code)) {
        console.warn("⚠️ Código de clima inválido:", code);
        // Si no es válido, devuelve la descripción por defecto (cielo despejado)
        return WEATHER_MAP[0] || '🌡️ Clima desconocido';
    }
    
    // Busca el código en el diccionario WEATHER_MAP
    // Si existe: retorna la descripción (ej: "☀️ Cielo despejado")
    // Si no existe: retorna una descripción genérica de clima desconocido
    return WEATHER_MAP[code] || '🌡️ Clima desconocido';
}

/**
 * Valida que las coordenadas sean válidas para el planeta Tierra
 * 
 * Validaciones:
 * - Son números (no strings, null, undefined)
 * - No son NaN o Infinity
 * - Latitud: -90 a 90
 * - Longitud: -180 a 180
 * 
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {boolean} true si válidas, false si no
 * 
 * @example
 * isValidCoordinates(-33.8688, -51.2093)  // true (Santiago, Chile)
 * isValidCoordinates(91, 0)                // false (fuera de rango)
 * isValidCoordinates(null, 0)              // false (no es número)
 * isValidCoordinates(NaN, 100)             // false (contiene NaN)
 */
function isValidCoordinates(lat, lon) {
    // PASO 1: Verificar que AMBOS parámetros sean del tipo 'number'
    // Rechaza: strings ("33"), null, undefined, objetos, etc.
    if (typeof lat !== 'number' || typeof lon !== 'number') {
        console.warn("⚠️ Coordenadas no son números:", { lat, lon });
        return false;
    }
    
    // PASO 2: Verificar que NO sean NaN (Not a Number)
    // Ejemplo de NaN: Math.sqrt(-1), Number('abc'), etc.
    if (isNaN(lat) || isNaN(lon)) {
        console.warn("⚠️ Coordenadas contienen NaN:", { lat, lon });
        return false;
    }
    
    // PASO 3: Verificar que NO sean Infinity (infinito)
    // isFinite() retorna true solo para números normales (entre -∞ y +∞)
    if (!isFinite(lat) || !isFinite(lon)) {
        console.warn("⚠️ Coordenadas contienen Infinity:", { lat, lon });
        return false;
    }
    
    // PASO 4: Verificar que estén dentro de los rangos geográficos del planeta Tierra
    // Latitud:  -90 (Sur) a +90 (Norte)
    // Longitud: -180 (Oeste) a +180 (Este)
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        console.warn("⚠️ Coordenadas fuera de rango:", { lat, lon });
        return false;
    }
    
    // Si pasó todas las validaciones, las coordenadas son válidas
    return true;
}

/**
 * Obtiene coordenadas de una ciudad llamando a API de geocoding
 * 
 * @param {string} cityName - Nombre de la ciudad a buscar
 * @returns {Promise<Object>} Objeto con { latitude, longitude, name, country }
 * @throws {Error} Si la ciudad no se encuentra o hay error de API
 * 
 * @example
 * const coords = await getCoordinatesFromCity('Santiago');
 * // Retorna: { latitude: -33.8688, longitude: -51.2093, name: 'Santiago', country: 'Chile' }
 */
async function getCoordinatesFromCity(cityName) {
    // VALIDACIÓN: Verificar que sea un string no vacío
    if (!cityName || typeof cityName !== 'string') {
        throw new Error('Nombre de ciudad inválido');
    }
    
    try {
        // Llamar a la API de geocoding de Open-Meteo
        // Parámetros:
        //   - name: ciudad a buscar (codificada para URL)
        //   - count: 1 (solo el resultado más relevante)
        //   - language: es (nombres en español)
        //   - format: json (respuesta en JSON)
        const response = await fetch(
            `${API_ENDPOINTS.geocoding}?name=${encodeURIComponent(cityName.trim())}&count=1&language=es&format=json`
        );
        
        // Si la respuesta HTTP no es exitosa (2xx), lanzar error
        // Ejemplos: 404 (no encontrado), 500 (error servidor), etc.
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        // Convertir respuesta JSON a objeto JavaScript
        const data = await response.json();
        
        // Validar que la respuesta tenga el formato esperado
        // - data.results debe existir
        // - debe ser un array
        // - debe tener al menos 1 elemento
        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            throw new Error('Ciudad no encontrada');
        }
        
        // Extraer el PRIMER resultado (el más relevante)
        // La API devuelve ordenado de más a menos relevante
        const city = data.results[0];
        
        // Retornar un objeto con las coordenadas y datos de la ciudad
        // Usar valores por defecto ('Desconocido') si algún campo viene vacío
        return {
            latitude: city.latitude,      // Coordenada vertical (-90 a +90)
            longitude: city.longitude,    // Coordenada horizontal (-180 a +180)
            name: city.name || 'Desconocido',           // Nombre de la ciudad
            country: city.country || 'Desconocido'      // Nombre del país
        };
        
    } catch (error) {
        // Si algo falla (red, validación, API), registrar y lanzar el error
        console.error("❌ Error en geocoding:", error.message);
        throw error;  // Error se propaga al llamador
    }
}

/**
 * Obtiene datos del clima actual y pronóstico de 7 días
 * 
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} Objeto con current_weather y daily forecast
 * @throws {Error} Si hay error de API o respuesta inválida
 * 
 * @example
 * const weather = await fetchWeatherData(-33.8688, -51.2093);
 * // Retorna: { current_weather: {...}, daily: {...} }
 */
async function fetchWeatherData(lat, lon) {
    // VALIDACIÓN: Verificar que las coordenadas sean válidas antes de llamar API
    // (evita hacer llamadas innecesarias si hay datos malos)
    if (!isValidCoordinates(lat, lon)) {
        throw new Error('Coordenadas inválidas');
    }
    
    try {
        // Llamar a la API de clima de Open-Meteo
        // Parámetros:
        //   - latitude/longitude: ubicación
        //   - current_weather=true: obtener clima ACTUAL
        //   - daily=...: obtener pronóstico de 7 DÍAS con estos datos:
        //     * temperature_2m_max: temperatura máxima
        //     * temperature_2m_min: temperatura mínima
        //     * precipitation_probability_max: probabilidad de lluvia
        //     * weathercode: código WMO (tipo de clima)
        //   - timezone=auto: convertir horarios automáticamente
        const response = await fetch(
            `${API_ENDPOINTS.weather}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`
        );
        
        // Validar que la respuesta HTTP sea exitosa
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        // Parsear la respuesta JSON
        const data = await response.json();
        
        // Validar que la ESTRUCTURA de datos sea la esperada
        // Debe tener:
        //   - current_weather: objeto con clima actual
        //   - daily: objeto con pronóstico de 7 días
        if (!data.current_weather || !data.daily) {
            throw new Error('Estructura de datos inesperada');
        }
        
        // Si todo es válido, retornar el objeto completo
        // (contiene current_weather y daily)
        return data;
        
    } catch (error) {
        console.error("❌ Error en weather API:", error.message);
        throw error;  // Propagar el error al llamador
    }
}

/**
 * Agrega una ciudad al historial de búsquedas (máximo 10, sin duplicados)
 * 
 * Mantiene orden cronológico: más recientes arriba
 * Se guarda en localStorage para persistencia entre sesiones
 * 
 * @param {string} cityName - Nombre de la ciudad a agregar (formato: "Ciudad, País")
 * @returns {void}
 * 
 * @example
 * addToSearchHistory('Santiago, Chile');
 * // searchHistory = ['Santiago, Chile', 'Madrid', ...]
 */
function addToSearchHistory(cityName) {
    // VALIDACIÓN 1: Verificar que cityName sea un string válido
    // Rechaza: null, undefined, números, objetos
    if (!cityName || typeof cityName !== 'string') {
        console.warn('⚠️ cityName inválido:', cityName);
        return;  // Cancelar si no es válido
    }
    
    // VALIDACIÓN 2: Eliminar espacios al inicio/fin
    const trimmed = cityName.trim();
    
    // Si quedó vacío después de trim (ej: "   "), cancelar
    if (trimmed.length === 0) return;
    
    // PASO 1: Evitar duplicados
    // searchHistory = ['Santiago, Chile', 'Madrid', 'Tokyo']
    // Si nuevamente buscamos "Santiago, Chile", primero lo removemos
    // Usamos filter() para crear un nuevo array sin ese elemento
    // Resultado: ['Madrid', 'Tokyo'] (sin duplicado)
    searchHistory = searchHistory.filter(city => city !== trimmed);
    
    // PASO 2: Agregar la ciudad al INICIO del array
    // Más recientes primero (búsqueda más reciente aparece al principio)
    // unshift() = agregar al inicio
    // shift() = quitar del inicio
    // push() = agregar al final
    // pop() = quitar del final
    searchHistory.unshift(trimmed);  // Resultado: ['Santiago, Chile', 'Madrid', 'Tokyo']
    
    // PASO 3: Mantener máximo 10 búsquedas
    // Si ya hay 10, quitar la más antigua (la del final)
    // Ej: si llegamos a 11 elementos, pop() elimina el último
    if (searchHistory.length > 10) {
        searchHistory.pop();  // Quitar la más antigua
    }
    
    // PASO 4: Guardar en localStorage para persistencia
    // El usuario cierra el navegador y vuelve: el historial sigue ahí
    // JSON.stringify() = convertir array a string JSON
    // ej: ["Santi", "Madrid"] → '["Santiago","Madrid"]'
    try {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
        // Si localStorage está lleno o deshabilitado (navegación privada)
        // Solo registrar el error, no impide que continue
        console.error("❌ Error guardando historial:", error);
    }
    
    // PASO 5: Actualizar la UI con el nuevo historial
    // Redibuja los botones en el div #history
    displaySearchHistory();
}

// =========================================
// 3. FUNCIONES PARA MANEJAR ERRORES
// =========================================

/**
 * Obtiene sugerencias de ciudades mientras el usuario escribe
 * 
 * Con debounce de 400ms para no sobrecargar la API
 * Valida input y maneja errores de red
 * Utiliza DOM API (no innerHTML) para seguridad XSS
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Usuario escribe en input, se llama automáticamente showSuggestions()
 * // que despacha esta función cada 400ms
 */
async function fetchSuggestions() {
    // Obtener el valor del input del usuario y eliminar espacios en blanco al inicio/fin
    // Si el elemento no existe, usar string vacío (\"\")
    const input = document.getElementById("cityInput")?.value.trim() || "";
    
    // Obtener el div donde mostrar las sugerencias
    const suggestionsDiv = document.getElementById("suggestions");
    
    // Si el div no existe en el HTML, cancelar (el usuario podría haber removido el elemento)
    if (!suggestionsDiv) return;
    
    // PASO 1: Limpiar sugerencias anteriores
    // (Antes de mostrar nuevas, borrar las viejas)
    suggestionsDiv.innerHTML = "";
    
    // PASO 2: Validación 1 - Mínimo 2 caracteres
    // Evita buscar por inputs muy cortos (ej: "a", "ab")
    if (input.length < 2) return;
    
    // PASO 3: Validación 2 - Solo caracteres válidos
    // PermiteLETRAS (a-z, A-Z), ACENTOS (á, é, í, ó, ú, ñ), ESPACIOS y GUIONES
    // Rechaza: números, símbolos especiales, caracteres de inyección
    // Regex: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-,]+$/ significa:
    //   ^ = inicio de string
    //   [a-zA-Z...] = caracteres permitidos
    //   + = uno o más caracteres
    //   $ = fin de string
    if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-,]+$/.test(input)) {
        console.warn("⚠️ Input contiene caracteres inválidos");
        return;  // Cancelar búsqueda por seguridad
    }
    
    try {
        // PASO 4: Llamar la API de geocoding
        // Parámetros:
        //   - count=5: obtener hasta 5 ciudades coincidentes
        //   - language=es: nombres en español
        //   - encodeURIComponent(): escapar caracteres especiales en la URL
        const response = await fetch(
            `${API_ENDPOINTS.geocoding}?name=${encodeURIComponent(input)}&count=5&language=es&format=json`
        );
        
        // PASO 5: Validar respuesta HTTP
        // Si status no es 2xx (ej: 404, 500), mostrar error al usuario
        if (!response.ok) {
            showError("Error de conexión con API de ciudades");
            return;  // Cancelar búsqueda
        }
        
        // Parsear respuesta JSON a objeto JavaScript
        const data = await response.json();
        
        // PASO 6: Validar estructura de datos
        // Debe tener: data.results que sea un array
        if (!data.results || !Array.isArray(data.results)) {
            console.warn("⚠️ Estructura de datos inesperada en sugerencias");
            return;  // Cancelar si la respuesta no es como esperamos
        }
        
        // PASO 7: Si no hay resultados, salir sin mostrar nada
        // (Experiencia más limpia que mostrar "Sin resultados")
        if (data.results.length === 0) return;
        
        // PASO 8: Crear un DocumentFragment para mejor rendimiento
        // Fragment = container invisible que almacena elementos
        // Ventaja: al agregar 5 elementos de una vez, solo 1 "reflow" (recálculo de layout)
        // vs. 5 reflows si los agregamos uno por uno
        const fragment = document.createDocumentFragment();
        
        // Iterar cada ciudad encontrada
        data.results.forEach(city => {
            // Crear un div para cada sugerencia
            const div = document.createElement("div");
            
            // Usar textContent (NO innerHTML) para SEGURIDAD XSS
            // Si usáramos innerHTML, un usuario malintencionado podría inyectar: "<img src=x onerror=alert('Hacked')>"
            // textContent trata TODO como texto plano, no puede ejecutar scripts
            div.textContent = `${city.name || 'N/A'}, ${city.country || 'N/A'}`;
            
            // Agregar event listener seguro (NO onclick inline en HTML)
            // onclick inline es vulnerable: onclick="doSomething()" puede ser manipulado
            div.addEventListener('click', () => {
                // Cuando el usuario hace click:
                // 1. Llenar el input con el nombre de la ciudad
                document.getElementById('cityInput').value = city.name;
                
                // 2. Limpiar las sugerencias (cerrar lista desplegable)
                suggestionsDiv.innerHTML = "";
                
                // 3. Llamar directamente con coordenadas (más eficiente que buscar por nombre de nuevo)
                getWeather(city.latitude, city.longitude, city.name, city.country);
            });
            
            // Agregar el div al fragment (no al DOM aún)
            fragment.appendChild(div);
        });
        
        // PASO 9: Agregar TODO el fragment de una vez al DOM
        // Esto causa solo 1 reflow (recálculo de layout), no 5
        suggestionsDiv.appendChild(fragment);
        
    } catch (error) {
        console.error("❌ Error en fetchSuggestions:", error.message);
        showError("Error al buscar ciudades");
    }
}

/**
 * Debounce wrapper para fetchSuggestions
 * Evita llamadas excesivas a la API mientras el usuario escribe
 * 
 * Espera 400ms sin nueva entrada antes de llamar fetchSuggestions()
 * 
 * @returns {void}
 * 
 * @example
 * // Se llama en oninput del input
 * <input oninput="showSuggestions()">
 */
function showSuggestions() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fetchSuggestions();
    }, 400);
}

/**
 * Verifica si hay alertas meteorológicas según condiciones
 * 
 * Usa ruleset configurable (ALERT_RULES) en lugar de condicionales anidados
 * Primera regla que coincida genera la alerta
 * 
 * Niveles: danger (rojo), warning (naranja), info (azul)
 * 
 * @param {number} weatherCode - Código WMO de clima
 * @param {number} windSpeed - Velocidad viento en km/h
 * @param {number} rainProb - Probabilidad de lluvia 0-100
 * @returns {void}
 * 
 * @example
 * checkWeatherAlerts(95, 30, 40);  // Genera alerta de tormenta
 * checkWeatherAlerts(0, 100, 0);   // Genera alerta de vendaval
 * checkWeatherAlerts(0, 30, 20);   // No genera alerta
 */
function checkWeatherAlerts(weatherCode, windSpeed, rainProb) {
    // VALIDACIÓN: Verificar que todos los parámetros sean números válidos
    // Para poder compararlos (ej: windSpeed > 80)
    if (typeof weatherCode !== 'number' || typeof windSpeed !== 'number' || typeof rainProb !== 'number') {
        console.warn("⚠️ Parámetros de alerta inválidos");
        return;  // Cancelar si faltan datos
    }
    
    // PASO 1: Buscar la PRIMERA regla de ALERT_RULES que cumpla la condición
    // Array.find() devuelve el primer elemento que cumple, o undefined si ninguno cumple
    // Orden de evaluación: tormenta extrema → precipitación extrema → vendaval → ... etc
    // Primera coincidencia gana (ej: si hay tormenta Y vendaval, muestra "Tormenta extrema")
    const matchedAlert = ALERT_RULES.find(rule => 
        rule.condition(weatherCode, windSpeed, rainProb)  // Evaluar: ¿Cumple esta regla?
    );
    
    // PASO 2: Si algunaregla coincidió, mostrar la alerta
    if (matchedAlert) {
        // matchedAlert = { name: '...', condition: fn, message: '...', level: '...' }
        console.info(`ℹ️ Alerta: ${matchedAlert.name}`);
        
        // Mostrar mensaje visual al usuario
        // matchedAlert.message = ej: "⚡ ALERTA: Tormenta eléctrica detectada"
        // matchedAlert.level = ej: "danger" (rojo), "warning" (naranja), "info" (azul)
        showWeatherAlert(matchedAlert.message, matchedAlert.level);
    }
    // Si NO hay coincidencia, no mostrar nada (clima normal)
}

/**
 * Muestra una alerta meteorológica en la UI
 * 
 * Crea elemento DOM (no usa innerHTML) para seguridad XSS
 * Utiliza Bootstrap alert dismissible
 * Se agrega encima del contenido de resultados
 * 
 * @param {string} msg - Mensaje de alerta (ej: "⚡ ALERTA: Tormenta")
 * @param {string} level - Nivel de criticidad: 'danger', 'warning', 'info'
 * @returns {void}
 * 
 * @example
 * showWeatherAlert('⚡ ALERTA: Tormenta extrema', 'danger');
 */
function showWeatherAlert(msg, level) {
    // VALIDACIÓN 1: Verificar que el mensaje sea un string no vacío
    if (typeof msg !== 'string' || !msg.trim()) {
        console.warn("⚠️ Mensaje de alerta vacío");
        return;  // Cancelar si el mensaje no es válido
    }
    
    // VALIDACIÓN 2: Verificar que el nivel sea uno de los permitidos
    // Niveles válidos: 'danger' (rojo), 'warning' (naranja), 'info' (azul)
    const validLevels = ['danger', 'warning', 'info'];
    if (!validLevels.includes(level)) {
        console.warn(`⚠️ Nivel de alerta inválido: ${level}`);
        level = 'info';  // Usar 'info' como nivel por defecto
    }
    
    // PASO 1: Obtener el contenedor donde mostrar la alerta
    // div#result = donde van a estar todos los resultados del clima
    const resultDiv = document.getElementById("result");
    if (!resultDiv) {
        console.warn("⚠️ Elemento #result no encontrado");
        return;  // Cancelar si el elemento no existe en HTML
    }
    
    // PASO 2: Crear elemento alert usando DOM API (seguro contra XSS)
    // NO usar: resultDiv.innerHTML = "<div>..." (vulnerable a XSS)
    // SÍ usar: createElement() + textContent (seguro)
    const alert = document.createElement('div');
    
    // Aplicar clases Bootstrap
    // alert = estilo de alerta
    // alert-${level} = color según nivel (alert-danger, alert-warning, etc)
    // alert-dismissible = agrega botón X para cerrar
    // fade show = animación de Bootstrap
    alert.className = `alert alert-${level} alert-dismissible fade show`;
    
    // Atributo ARIA para accesibilidad (lectores de pantalla)
    alert.setAttribute('role', 'alert');
    
    // PASO 3: Crear el contenedor del mensaje
    const messageSpan = document.createElement('span');
    // Usar textContent (NO innerHTML) para seguridad XSS
    // innerHTML: si msg = "<img src=x onerror='alert(1)'>", ejecuta el script
    // textContent: trata TODO como texto literal, sin ejecutar scripts
    messageSpan.textContent = msg;
    alert.appendChild(messageSpan);
    
    // PASO 4: Crear botón de cerrar
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';  // Botón de cerrar Bootstrap (X)
    closeBtn.setAttribute('data-bs-dismiss', 'alert');  // Al hacer click, Bootstrap cierra la alerta
    closeBtn.setAttribute('aria-label', 'Cerrar');      // Label para accesibilidad
    alert.appendChild(closeBtn);
    
    // PASO 5: Insertar la alerta al INICIO del resultDiv
    // insertBefore(newElement, referenceElement)
    // Inserta la alerta antes del primer hijo
    // Resultado: la alerta aparece ENCIMA del resultado del clima
    resultDiv.insertBefore(alert, resultDiv.firstChild);
}

/**
 * Muestra un mensaje de error al usuario
 * 
 * Actualiza el div #result con mensaje de error formateado
 * Útil para validaciones y errores de API
 * 
 * @param {string} message - Mensaje de error a mostrar
 * @returns {void}
 * 
 * @example
 * showError("La ciudad no existe en nuestra base de datos");
 */
function showError(message) {
    const resultDiv = document.getElementById("result");
    if (!resultDiv) return;
    
    // Validar mensaje
    const safeMessage = (typeof message === 'string' && message.trim()) 
        ? message.trim() 
        : 'Error desconocido';
    
    // Crear elemento de error usando DOM API (seguro)
    resultDiv.innerHTML = ""; // Limpiar anterior
    const errorEl = document.createElement('p');
    errorEl.className = 'text-danger';
    errorEl.textContent = `⚠️ ${safeMessage}`;
    resultDiv.appendChild(errorEl);
}

// =========================================
// 4. FUNCIONES RESPECTO AL DISEÑO (UI & THEME)
// =========================================

/**
 * Compone y renderiza los datos del clima en HTML
 * 
 * Responsable únicamente de presentación, NO lógica
 * Utiliza template literal seguro (los datos ya están validados)
 * Incluye pronóstico de 7 días
 * 
 * @param {Object} weatherData - Objeto con current_weather y daily
 * @param {string} cityName - Nombre de la ciudad
 * @param {string} country - Nombre del país
 * @returns {string} HTML formateado listo para insertar
 * 
 * @example
 * const html = renderWeatherResults(weatherData, 'Santiago', 'Chile');
 * resultDiv.innerHTML = html;
 */
function renderWeatherResults(weatherData, cityName, country) {
    // PASO 1: Extraer los objetos principales de la respuesta API
    const { current_weather, daily } = weatherData;
    // current_weather = { temperature: 22.5, windspeed: 15, ... }
    // daily = { temperature_2m_max: [...], temperature_2m_min: [...], ... }
    
    // PASO 2: Extraer y PROCESAR el clima actual
    // La API retorna:
    //   - currentTemp en decimal (ej: 22.456)
    //   - Redondeamos a 1 decimal: Math.round(22.456 * 10) / 10 = 22.5
    const currentTemp = Math.round(current_weather.temperature * 10) / 10;
    
    // Viento ya viene en número redondo, pero lo redondeamos igual por consistencia
    const windSpeed = Math.round(current_weather.windspeed);
    
    // PASO 3: Extraer datos del pronóstico de HOY (primer elemento del array)
    // [0] = hoy, [1] = mañana, [2] = pasado mañana, etc.
    const maxTemp = Math.round(daily.temperature_2m_max[0] * 10) / 10;        // Ej: 28.3
    const minTemp = Math.round(daily.temperature_2m_min[0] * 10) / 10;        // Ej: 15.2
    const rainProb = daily.precipitation_probability_max[0];                   // Ej: 40
    const weatherCode = daily.weathercode[0];                                  // Ej: 0 (código WMO)
    
    // PASO 4: Convertir el código WMO a descripción legible con emoji
    // Ej: 0 → "☀️ Cielo despejado"
    const weatherDescription = interpretWeather(weatherCode);
    
    // PASO 5: Construir el HTML con template literal
    // NOTA: Los valores de variables (${...}) están "escapados" porque:
    //   - son números y strings generados por nosotros
    //   - NO vienen directamente del input del usuario
    //   - Por lo tanto, sin riesgo de XSS
    const html = `
        <h4>${cityName}, ${country}</h4>
        <p><strong>🌡️ Temperatura actual:</strong> ${currentTemp}°C</p>
        <p><strong>🔼 Máxima:</strong> ${maxTemp}°C</p>
        <p><strong>🔽 Mínima:</strong> ${minTemp}°C</p>
        <p><strong>💨 Viento:</strong> ${windSpeed} km/h</p>
        <p><strong>🌧️ Precipitación:</strong> ${rainProb}%</p>
        <p><strong>📌 Estado:</strong> ${weatherDescription}</p>
    `;
    
    // PASO 6: Agregar el pronóstico de 7 días
    // displayForecast() retorna HTML con tarjetas de los próximos 7 días
    return html + displayForecast(daily);
}

/**
 * Genera HTML para el pronóstico de 7 días en grid responsivo
 * 
 * Grid Bootstrap:
 * - Mobile (xs): 2 columnas (col-6)
 * - Tablet (md): 3 columnas (col-md-4)
 * - Desktop (lg): 4 columnas (col-lg-3)
 * 
 * Cada tarjeta muestra: día, fecha, condición emoji, temp máx/mín, % lluvia
 * 
 * @param {Object} forecastData - Objeto daily de Open-Meteo API
 * @returns {string} HTML con grid de tarjetas de pronóstico
 * 
 * @example
 * const forecastHTML = displayForecast(weatherData.daily);
 * // Retorna: <h5>📅 Pronóstico...</h5><div class="row">...</div>
 */
function displayForecast(forecastData) {
    // VALIDACIÓN: Verificar que el objeto tenga los datos necesarios
    // Si la API devuelve respuesta mal formada, retorna string vacío (sin crashear)
    if (!forecastData || !forecastData.temperature_2m_max) {
        console.warn("⚠️ Datos de pronóstico inválidos");
        return "";  // Retornar HTML vacío en lugar de mostrar error
    }
    
    // PASO 1: Crear encabezado del pronóstico
    let forecastHTML = "<h5 class='mt-4 mb-3'>📅 Pronóstico de 7 Días</h5>";
    
    // PASO 2: Crear grid Bootstrap para las tarjetas
    // Grid responsivo: 2 cols en mobile, 3 en tablet, 4 en desktop
    forecastHTML += "<div class='row g-2'>";
    
    // PASO 3: Determinar cuántos días mostrar
    // Mínimo de: 7 días O cuantos días tenga la API (por si retorna menos)
    const daysToShow = Math.min(7, forecastData.temperature_2m_max.length);
    
    // PASO 4: Iterar para cada día (hoy, mañana, pasado mañana, ...)
    for (let i = 0; i < daysToShow; i++) {
        // Crear objeto Date para calcular fecha
        const date = new Date();
        
        // Sumar i días a la fecha actual
        // i=0 → hoy
        // i=1 → mañana
        // i=7 → hace 7 días desde hoy
        date.setDate(date.getDate() + i);
        
        // Obtener nombre del día en español
        // locale 'es-ES' → monés
        // weekday: 'short' → 3 caracteres ("Lun", "Mar", ...)
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        
        // Extraer datos de pronóstico del día i
        const maxTemp = Math.round(forecastData.temperature_2m_max[i] * 10) / 10;
        const minTemp = Math.round(forecastData.temperature_2m_min[i] * 10) / 10;
        const weatherCode = forecastData.weathercode[i];      // Código WMO
        const condition = interpretWeather(weatherCode);      // Descripción con emoji
        const rainProb = forecastData.precipitation_probability_max[i];  // % lluvia
        
        // Formatear fecha: "d/m" (ej: "14/4" para 14 de abril)
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
        // NOTA: getMonth() retorna 0-11, por eso sumamos 1 (0=enero, 11=diciembre)
        
        // PASO 5: Crear tarjeta para este día
        // Estructura Bootstrap: col-6 (mobile), col-md-4 (tablet), col-lg-3 (desktop)
        // h-100 = altura 100% (todas las tarjetas igual altura)
        forecastHTML += `
            <div class='col-6 col-md-4 col-lg-3'>
                <div class='card forecast-card h-100'>
                    <div class='card-body text-center p-2'>
                        <h6 class='forecast-day'>${dayName}</h6>
                        <p class='forecast-date'>${dateStr}</p>
                        <p class='forecast-condition mb-2'>${condition}</p>
                        <p class='forecast-temp mb-1'>
                            <strong>${maxTemp}°</strong><span class='forecast-min'>/${minTemp}°</span>
                        </p>
                        <p class='forecast-rain'>🌧️ ${rainProb}%</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // PASO 6: Cerrar el grid
    forecastHTML += "</div>";
    
    // Retornar todo el HTML del pronóstico
    return forecastHTML;
}

/**
 * Muestra el historial de búsquedas como botones clicables
 * 
 * Utiliza DOM API (no innerHTML) para seguridad XSS
 * Botones son event listeners, no inline onclick
 * Máximo 10 búsquedas recientes (más recientes arriba)
 * 
 * @returns {void}
 * 
 * @example
 * displaySearchHistory();
 * // Renderiza: [Santiago] [Madrid] [Tokyo] [...] en #history
 */
function displaySearchHistory() {
    // Obtener el div donde renderizar el historial
    const historyDiv = document.getElementById("history");
    if (!historyDiv) return;  // Si el elemento no existe en HTML, cancelar
    
    // CASO 1: Si el historial está vacío, mostrar mensaje
    if (searchHistory.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-muted small';  // Estilo: texto gris y pequeño
        emptyMsg.textContent = 'Sin historial';   // Mensaje al usuario
        historyDiv.innerHTML = "";                // Limpiar contenido anterior
        historyDiv.appendChild(emptyMsg);          // Agregar el mensaje
        return;  // Terminar aquí si no hay búsquedas previas
    }
    
    // CASO 2: Si hay historial, mostrar la lista de búsquedas recientes
    
    // PASO 1: Limpiar el div (remover búsquedas antiguas del render anterior)
    historyDiv.innerHTML = "";
    
    // PASO 2: Crear título
    const title = document.createElement('p');
    title.className = 'small fw-bold';       // Estilo: pequeño y negrita
    title.textContent = '📋 Búsquedas recientes:';  // Texto
    historyDiv.appendChild(title);            // Agregar al div
    
    // PASO 3: Crear contenedor para los botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'mt-2';     // Estilo: margen superior
    
    // PASO 4: Crear Fragment para mejor rendimiento
    // Fragment = contenedor invisible
    // Al agregar 10 botones de una vez, solo 1 reflow vs. 10 reflows
    const fragment = document.createDocumentFragment();
    
    // PASO 5: Iterar cada ciudad en el historial (máximo 10)
    // searchHistory = ['Santiago, Chile', 'Madrid, España', ...]
    searchHistory.forEach(city => {
        // Crear botón para esta búsqueda
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-secondary me-2 mb-2';  // Estilo Bootstrap
        btn.textContent = city;  // Mostrar nombre de la ciudad
        
        // Agregar event listener (click en el botón)
        // NO usar onclick inline por seguridad
        btn.addEventListener('click', () => {
            // 1. Llenar el input con la ciudad seleccionada
            document.getElementById('cityInput').value = city;
            
            // 2. Parsear: "Santiago, Chile" → city="Santiago", country="Chile"
            // split(', ') divide por coma+espacio
            // parts[0] = primera parte (ciudad)
            // parts[1] = segunda parte (país) o '' si no existe
            const parts = city.split(', ');
            const cityName = parts[0];           // Ejemplo: "Santiago"
            const country = parts[1] || '';      // Ejemplo: "Chile" o ""
            
            // 3. Buscar el clima de esa ciudad
            // Pasamos null para lat/lon porque vamos a obtenerlos por geocoding
            getWeather(null, null, cityName, country);
        });
        
        // Agregar botón al fragment (no al DOM aún)
        fragment.appendChild(btn);
    });
    
    // PASO 6: Agregar TODO el fragment de una vez al contenedor
    // Esto causa solo 1 reflow en el navegador
    buttonsContainer.appendChild(fragment);
    
    // PASO 7: Finalmente, agregar el contenedor al historyDiv
    historyDiv.appendChild(buttonsContainer);
}

/**
 * Cambia el tema actual entre 'light' y 'dark'
 * 
 * Alterna el tema y lo guarda en localStorage
 * Llama funciones para aplicar tema y actualizar botón
 * 
 * @returns {void}
 * 
 * @example
 * toggleTheme(); // Si estaba en light, cambia a dark
 * toggleTheme(); // Si estaba en dark, cambia a light
 */
function toggleTheme() {
    // PASO 1: Alternar entre 'light' y 'dark'
    // Si está en light → cambiar a dark
    // Si está en dark → cambiar a light
    // Este es un patrón común en JavaScript
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    // Operador ternário: condición ? value_si_verdadero : value_si_falso
    
    // PASO 2: Guardar preferencia en localStorage
    // Para que persista cuando el usuario cierra y vuelve a abrir
    try {
        localStorage.setItem('theme', currentTheme);  // Guarda: "light" o "dark"
    } catch (error) {
        // Si localStorage está deshabilitado (navegación privada), solo registrar error
        console.error("❌ Error guardando tema:", error);
    }
    
    // PASO 3: Aplicar el tema al DOM
    // Cambia colores, backgrounds, etc. según el nuevo tema
    applyTheme(currentTheme);
    
    // PASO 4: Actualizar el texto del botón
    // Muestra "🌙 Oscuro" en light mode (sugerencia: cambiar a oscuro)
    // Muestra "☀️ Claro" en dark mode (sugerencia: cambiar a claro)
    updateThemeButton();
}

/**
 * Aplica el tema a la página
 * 
 * Establece atributo data-bs-theme para Bootstrap
 * Bootstrap automáticamente maneja todos los colores vía CSS
 * 
 * NOTA: Los colores de fondo de body están en CSS, 
 * aquí solo se cambia el atributo de tema
 * 
 * @param {string} theme - 'light' o 'dark'
 * @returns {void}
 * 
 * @example
 * applyTheme('dark');  // La página se verá en modo oscuro
 * applyTheme('light'); // La página se verá en modo claro
 */
function applyTheme(theme) {
    // VALIDACIÓN: Verificar que el tema sea uno de los permitidos
    // Solo aceptamos 'light' o 'dark'
    if (!['light', 'dark'].includes(theme)) {
        console.warn(`⚠️ Tema inválido: ${theme}`);
        return;  // Cancelar si es inválido
    }
    
    // PASO 1: Obtener el elemento raíz del HTML
    // document.documentElement = etiqueta <html></html>
    const html = document.documentElement;
    
    // PASO 2: Establecer atributo data-bs-theme para Bootstrap
    // Bootstrap es un framework CSS que responde al atributo data-bs-theme
    // Auto-ajusta TODOS los colores, bordes, backgrounds según el valor
    // Ej: botones, cards, backgrounds, texto, etc.
    html.setAttribute('data-bs-theme', theme);
    // Resultado: <html data-bs-theme="dark"> → Bootstrap aplica Dark Mode
    
    // PASO 3: Establecer el color de fondo del body
    // THEME_CONFIG.dark.bgColor = '#1a1a1a' (gris oscuro)
    // THEME_CONFIG.light.bgColor = '#e0f7f7' (cian claro)
    // Accedemos al color correcto según el tema actual
    document.body.style.backgroundColor = THEME_CONFIG[theme].bgColor;
    // Resultado: <body style="background-color: #1a1a1a"> o #e0f7f7
}

/**
 * Actualiza el texto del botón de tema
 * 
 * Muestra "🌙 Oscuro" en modo light (sugerencia de acción)
 * Muestra "☀️ Claro" en modo dark (sugerencia de acción)
 * 
 * @returns {void}
 * 
 * @example
 * updateThemeButton();
 * // Si currentTheme='light': botón dice "🌙 Oscuro"
 * // Si currentTheme='dark': botón dice "☀️ Claro"
 */
function updateThemeButton() {
    const themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) {
        console.warn("⚠️ Elemento #themeToggle no encontrado");
        return;
    }
    
    themeBtn.textContent = currentTheme === 'light' 
        ? '🌙 Oscuro' 
        : '☀️ Claro';
}

// =========================================
// 5. FUNCIÓN PRINCIPAL - OBTENER CLIMA
// =========================================

/**
 * Función principal que orquesta toda la búsqueda y visualización del clima
 * 
 * Flujo:
 * 1. Validar entrada (input o coordenadas)
 * 2. Si no hay coordenadas, obtenerlas del nombre de ciudad
 * 3. Validar coordenadas
 * 4. Agregar al historial
 * 5. Obtener datos del clima
 * 6. Verificar alertas
 * 7. Renderizar resultados
 * 
 * Toda la lógica está separada en funciones más pequeñas para testabilidad
 * 
 * @param {number} lat - Latitud (opcional, si null busca por nombre)
 * @param {number} lon - Longitud (opcional, si null busca por nombre)
 * @param {string} cityName - Nombre de la ciudad (para historial)
 * @param {string} country - Nombre del país (para historial)
 * @returns {Promise<void>}
 * 
 * @example
 * // Caso 1: Con coordenadas (desde sugerencias)
 * await getWeather(-33.8688, -51.2093, 'Santiago', 'Chile');
 * 
 * // Caso 2: Con nombre de ciudad (desde input)
 * await getWeather(null, null, 'Madrid', '');
 * 
 * // Caso 3: Solo input (más común)
 * // Usuario presiona "Buscar clima", se toma valor de #cityInput
 * await getWeather();
 */
async function getWeather(lat = null, lon = null, cityName = "", country = "") {
    // Obtener referencias a los elementos del DOM
    const resultDiv = document.getElementById("result");  // Div para mostrar resultados
    const input = document.getElementById("cityInput")?.value.trim() || "";  // Lo que escribió el usuario
    
    // VALIDACIÓN INICIAL: Verificar que haya ALGO que buscar
    // Casos válidos:
    //   - input lleno: usuario escribió "Santiago"
    //   - lat/lon válidos: vino desde sugerencias (ej: click en "Santiago, Chile")
    if (!input && !lat) {
        showError("Ingresa una ciudad");
        return;  // Cancelar si no hay nada
    }
    
    try {
        // ================================================
        // PASO 1: OBTENER COORDENADAS (si no vienen)
        // ================================================
        // Dos formas de llegar aquí:
        //   A) Usuario escribió en input y presionó enter → lat=null, lon=null
        //   B) Usuario hizo click en sugerencia → lat/lon ya vienen
        if (!lat || !lon) {
            // Opción A: Buscar por nombre de ciudad
            // Usar el input del usuario, o el cityName si viene de historial
            const searchTerm = input || cityName;  // Prioritario: input > cityName
            
            // Llamar API de geocoding: "Santiago" → coordenadas
            const coords = await getCoordinatesFromCity(searchTerm);
            
            // Extraer los valores del objeto respuesta
            lat = coords.latitude;        // Ej: -33.8688
            lon = coords.longitude;       // Ej: -51.2093
            cityName = coords.name;       // Ej: "Santiago" (normalizado por API)
            country = coords.country;     // Ej: "Chile"
        }
        
        // ================================================
        // PASO 2: VALIDAR LAS COORDENADAS
        // ================================================
        // Doble verificación: la API podría devolver datos raros
        if (!isValidCoordinates(lat, lon)) {
            showError("Coordenadas inválidas");
            return;  // Cancelar si las coordenadas no son válidas
        }
        
        // ================================================
        // PASO 3: GUARDAR EN EL HISTORIAL
        // ================================================
        // Formato: "Santiago, Chile" (se guarda en localStorage y searchHistory)
        // Útil para que el usuario pueda hacer click de nuevo después
        addToSearchHistory(`${cityName}, ${country}`);
        
        // ================================================
        // PASO 4: OBTENER DATOS DEL CLIMA
        // ================================================
        // Llamar API de clima: coordenadas → temperatura, viento, código WMO, etc.
        const weatherData = await fetchWeatherData(lat, lon);
        // weatherData = {
        //   current_weather: { temperature: 22.5, windspeed: 15, weathercode: 0, ... },
        //   daily: { temperature_2m_max: [...], ..., weathercode: [...] }
        // }
        
        // ================================================
        // PASO 5: VERIFICAR ALERTAS METEOROLÓGICAS
        // ================================================
        // Parámetros:
        //   - weatherCode: código WMO (0=despejado, 95=tormenta, etc)
        //   - windSpeed: velocidad del viento en km/h
        //   - rainProb: probabilidad de lluvia 0-100%
        checkWeatherAlerts(
            weatherData.daily.weathercode[0],                    // Código WMO de HOY
            weatherData.current_weather.windspeed,              // Viento actual
            weatherData.daily.precipitation_probability_max[0]   // Lluvia de HOY
        );
        // Si hay alertas (ej: tormenta), showWeatherAlert() las muestra automáticamente
        
        // ================================================
        // PASO 6: RENDERIZAR RESULTADOS
        // ================================================
        // Convertir datos del clima a HTML y mostrarlo al usuario
        // Función pura (sin side-effects excepto retornar HTML)
        resultDiv.innerHTML = renderWeatherResults(weatherData, cityName, country);
        // Ahora el usuario ve: temperatura, máxima, mínima, viento, estado, pronóstico 7 días
        
    } catch (error) {
        // ================================================
        // MANEJO DE ERRORES
        // ================================================
        // Cualquier paso puede fallar (red, API, validación, etc)
        // Capturamos el error y mostramos un mensaje legible al usuario
        console.error("❌ Error general:", error.message);  // Log para debugging
        showError(error.message || "Error al obtener el clima");  // Mostrar al usuario
    }
}

// =========================================
// 5. INICIALIZACIÓN AL CARGAR PÁGINA
// =========================================

/**
 * Se ejecuta cuando el DOM está completamente cargado
 * Inicializa tema, historial, y event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Aplicar tema guardado
        applyTheme(currentTheme);
        updateThemeButton();
        
        // Mostrar historial de búsquedas
        displaySearchHistory();
        
        console.log("✅ Aplicación iniciada correctamente");
    } catch (error) {
        console.error("❌ Error en inicialización:", error);
    }
});

// =========================================
// 6. EXPORTACIÓN PARA TESTING
// =========================================

/**
 * Exportar funciones para Jest testing
 * Permite testear cada función independientemente
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Funciones lógicas
        interpretWeather,
        isValidCoordinates,
        getCoordinatesFromCity,
        fetchWeatherData,
        addToSearchHistory,
        
        // Funciones de error handling
        fetchSuggestions,
        showSuggestions,
        checkWeatherAlerts,
        showWeatherAlert,
        showError,
        
        // Funciones de diseño
        renderWeatherResults,
        displayForecast,
        displaySearchHistory,
        toggleTheme,
        applyTheme,
        updateThemeButton,
        
        // Función principal
        getWeather
    };
}