# 🌤️ App Clima GPT - Documentación Completa

## 📋 Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Guía de Uso](#guía-de-uso)
6. [Ejemplo de Resultados](#ejemplo-de-resultados)
7. [Lista de Funciones](#lista-de-funciones)
8. [Arquitectura Técnica](#arquitectura-técnica)
9. [Posibles Mejoras](#posibles-mejoras)
10. [Testing](#testing)
11. [Troubleshooting (posibles problemas al instalar la APP)](#troubleshooting)

---

## 🎯 Resumen del Proyecto

**App Clima GPT** es una aplicación web que permite a los usuarios consultar información meteorológica en tiempo real de cualquier ciudad del mundo. 

### Características Principales
- ✅ **Búsqueda de ciudades** con autocompletado inteligente
- ✅ **Información meteorológica completa**: temperatura actual, máxima/mínima, velocidad del viento y estado climático (Despejado, nublado, parcialmente nublado, niebla, lluvioso, nieve, tormenta, entre otros.)
- ✅ **Interpretación de códigos WMO** (estándares internacionales de clima): Estos códigos son los que nos entregan el estado del clima de cada ciudad y los trae la API de Open - Meteo.
- ✅ Manejo robusto de errores y validación de datos: Maneja errores de conexión con la API, errores de validación en los inputs (vacíos, ciudades no existentes, entre otros)
- ✅ **Interfaz responsiva** con Bootstrap 5
- ✅ **Debounce de búsqueda** para optimizar llamadas a API (400ms). Esto se implementa para evitar que el autocompletado que se le entrega al usuario, haga demasiadas llamadas a la API, pues de esta forma sería menos eficiente la aplicación. 

### Stack Tecnológico
- **Frontend**: HTML5, Bootstrap 5, CSS3, JavaScript (ES6+).
- **APIs**: Open-Meteo Geocoding API + Open-Meteo Weather API
- **Testing**: Jest (130+ casos de prueba)
- **Versionado**: Git

---

## 📁 Estructura del Proyecto

```
App-Clima-GPT/
│
├── src/                    # 📂 Código fuente
│   ├── index.html         # Archivo principal (DOM)
│   ├── script.js          # Lógica de la aplicación
│   └── styles.css         # Estilos personalizados
│
├── tests/                  # 📂 Suite de pruebas
│   └── script.test.js     # Pruebas unitarias (130+ tests con Jest)
│
├── docs/                   # 📂 Documentación
│   └── README.md          # Este archivo explicativo
│
├── jest.config.js         # Configuración de Jest
├── package.json           # Dependencias del proyecto
└── .gitignore             # Archivos ignorados por Git
```

### Descripción de Carpetas y Archivos

**`src/`**: Código fuente de la aplicación
- `index.html`: Estructura HTML, Define DOM, importa Bootstrap, vincula archivos CSS y JS
- `script.js`: Lógica de la aplicación, manejo y conexión de APIs, procesamiento de datos, DOM manipulation.
- `styles.css`: Estilos custom, Estilos específicos del front-end

**`tests/`**: Suite de pruebas
- `script.test.js`: Pruebas unitarias, 130+ tests con Jest (interpretación clima, validación, errores).

**`docs/`**: Documentación del proyecto
- `README.md`: Documentación completa (este archivo)

**Archivos de configuración (raíz)**
- `jest.config.js`: Configuración de Jest (covertura y ambiente de pruebas).
- `package.json`: Se definen los metadatos, los comandos (scripts) que puedes ejecutar y las dependencias necesarias (como Jest).
---

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

### Sistema
- **Node.js** v14+ ([Descargar](https://nodejs.org/))
- **npm** v6+ (viene con Node.js)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Conexión a Internet** (para APIs de Open-Meteo)

### Verificar Instalación
```bash
node --version   # Debería mostrar v14.0.0 o superior
npm --version    # Debería mostrar v6.0.0 o superior
```
---

## 🚀 Instalación y Configuración

### Paso 1: Clonar o Descargar el Proyecto
```bash
# Opción A: Clonar desde Git
git clone https://github.com/usuario/App-Clima-GPT.git
cd App-Clima-GPT

# Opción B: Descargar ZIP y extraer
# Luego abrir terminal en la carpeta
cd c:\ruta\a\App-Clima-GPT
```
### Paso 2: Instalar Dependencias
```bash
npm install
```
Esto instalará:
- ✅ Jest (framework de testing, para testear la APP y robustecer nuestro código)

### Paso 3: Verificar Instalación
```bash
npm test
```
Debería ver:
```
PASS  tests/script.test.js
  ✓ 130+ tests passed
  
Test Suites: 1 passed, 1 total
Tests:       130+ passed, 130+ total
```
OJO: En caso de que no vea lo anterior, significa que hay un error en el código y deberá depurarse.

### Paso 4: Ejecutar la Aplicación

**Opción A: Abrir directamente en navegador**
```bash
# En Windows
start src/index.html

# En macOS
open src/index.html

# En Linux
xdg-open src/index.html
```

**Opción B: Usar un servidor local (recomendado)**
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Luego acceder a http://localhost:8000/src
```
---

## 📖 Guía de Uso

### Para Usuarios Finales (UI)

#### 1. Buscar una Ciudad
```
1. Abre la aplicación en el navegador
2. Escribe el nombre de la ciudad (mínimo 2 caracteres)
   Ej: "Santiago", "New York", "Montréal"
3. Espera a que aparezcan las sugerencias
4. Haz clic en la ciudad deseada o presenta el botón "Buscar clima"
```

#### 2. Ver Resultados
Una vez seleccionada una ciudad, verás:
```
🌤️ Santiago, Chile
🌡️ Temperatura actual: 22°C
🔼 Máxima: 28°C
🔽 Mínima: 18°C
💨 Viento: 15 km/h
🌧️ Probabilidad de precipitación: 30%
📌 Estado: ⛅ Principalmente despejado

--- PRONÓSTICO DE 7 DÍAS ---
Hoy | Mañana | +2 | +3 | +4 | +5 | +6
28°C/18° | 27°C/17° | ...
```

#### 3. Historial de Búsquedas 📁
```
Las últimas 10 ciudades que buscaste aparecerán en "Histórico de búsquedas"
Haz clic en cualquiera para buscar de nuevo sin escribir
```

#### 4. Modo Oscuro/Claro 🌙
```
1. Haz clic en el botón "🌙 Oscuro" en la parte superior
2. La interfaz cambiará a modo oscuro
3. Tu preferencia se guardará automáticamente
4. Próxima vez que abras la app, tendrá el mismo tema
```

#### 5. Alertas Meteorológicas ⚠️
```
Si hay condiciones peligrosas, verás una alerta:
- 🔴 PELIGRO (rojo): Tormentas, vientos extremos
- 🟠 ADVERTENCIA (naranja): Fuertes vientos, lluvia intensa
- 🔵 INFO (azul): Información general
```

#### 6. Búsqueda Nueva
Para buscar otra ciudad, simplemente repite el proceso.

---

### Para Desarrolladores

#### Entender el Flujo Principal

```
┌─────────────────────────────────────┐
│     Usuario escribe "Santiago"      │
└────────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  showSuggestions()
    │  (Debounce 400ms)
    └────────┬────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  fetchSuggestions()              │
    │  API: geocoding-api.open-meteo.com
    │  Retorna: [Santiago-Chile, ...]  │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  Usuario selecciona      │
    │  Santiago, Chile         │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  getWeather(lat, lon)            │
    │  Extrae: -33.8688, -51.2093      │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  ✅ Valida coordenadas           │
    │  isValidCoordinates()            │
    │  Rango: -90 a 90, -180 a 180     │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  💾 Agregar a historial          │
    │  addToSearchHistory()            │
    │  localStorage: max 10 búsquedas  │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  Llama API de Clima              │
    │  api.open-meteo.com              │
    │  + daily forecast (7 días)       │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  Procesa datos de respuesta       │
    │  - Interpreta weathercode        │
    │  - Formatea temperaturas         │
    │  - Calcula velocidad viento      │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  ⚠️ Verifica Alertas             │
    │  checkWeatherAlerts()            │
    │  Detecta condiciones peligrosas  │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  Muestra pronóstico 7 días       │
    │  displayForecast()               │
    │  Grid responsive con datos       │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │  Muestra TODOS los resultados    │
    │  innerHTML en #result            │
    │  Incluye datos, pronóstico      │
    └──────────────────────────────────┘
```

---

## 💡 Ejemplo de Resultados

### Búsqueda 1: Santiago, Chile
**Input:** `Santiago`
**Sugerencias:**
```
Santiago, Chile
Santiago, Cuba
Santiago, Dominican Republic
```

**Resultado Final:**
```
🌤️ Santiago, Chile
🌡️ Temperatura actual: 22°C
🔼 Máxima: 28°C
🔽 Mínima: 18°C
💨 Viento: 15 km/h
🌧️ Probabilidad de precipitación: 30%
📌 Estado: ⛅ Principalmente despejado o parcialmente nublado
```

### Búsqueda 2: Tokyo
**Input:** `Tokyo`
**Resultado:**
```
🌤️ Tokyo, Japan
🌡️ Temperatura actual: 18°C
🔼 Máxima: 23°C
🔽 Mínima: 14°C
💨 Viento: 20 km/h
🌧️ Probabilidad de precipitación: 5%
📌 Estado: ☀️ Cielo despejado
```

### Búsqueda 3: Ciudad Inexistente
**Input:** `XyzNoExiste123`
**Resultado:**
```
❌ Ciudad no encontrada.
```

---

## 🔧 Lista de Funciones (contenidas en script.js)

### Funciones Principales

#### 1. `showSuggestions()` 
**Propósito:** Activar búsqueda con debounce  
**Lógica:**
- Limpia timeout anterior (cancel request anterior)
- Espera 400ms antes de llamar API
- Optimiza: evita 100 llamadas por escribir 10 caracteres

```javascript
function showSuggestions() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fetchSuggestions();
    }, 400);
}
```

#### 2. `fetchSuggestions()`
**Propósito:** Buscar sugerencias de ciudades  
**API:** `https://geocoding-api.open-meteo.com/v1/search`  
**Parámetros:**
- `name`: Nombre ciudad a buscar
- `count`: 5 resultados
- `language`: es (español)
- `format`: json

```javascript
const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=5&language=es&format=json`
);
```

**Manejo de Errores:**
- Si `input.length < 2`: No llamar API
- Si `!data.results`: Mostrar sugerencias vacías
- Si error: `console.error()` (no bloquea UI)

#### 3. `getWeather(lat, lon, cityName, country)`
**Propósito:** Obtener datos climáticos  
**Parámetros:**
- `lat`: Latitud (-90 a 90)
- `lon`: Longitud (-180 a 180)
- `cityName`: Nombre ciudad
- `country`: País

**Flujo:**
1. Si no hay `lat/lon`: Buscar geocoding primero
2. Validar coordenadas: `isValidCoordinates(lat, lon)`
3. Llamar API clima
4. Procesar datos
5. Mostrar en UI

```javascript
const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`
);
```

#### 4. `interpretWeather(code)`
**Propósito:** Convertir código WMO a descripción legible (estado del clima) 
**Entrada:** Código numérico (0-99)  
**Salida:** String con emoji y descripción

**Códigos principales:** (verificar mejor todos los códigos en el script.js)
| Código | Significado |
|--------|------------|
| 0 | ☀️ Cielo despejado |
| 1-3 | ⛅ Principalmente despejado |
| 45, 48 | 🌫️ Niebla |
| 51, 53, 55 | 🌦️ Llovizna |
| 61, 63, 65 | 🌧️ Lluvia |
| 71, 73, 75 | ❄️ Nieve |
| 95, 96, 99 | ⛈️ Tormenta |

#### 5. `isValidCoordinates(lat, lon)`
**Propósito:** Validar que coordenadas estén dentro del planeta  
**Validaciones:**
- Latitud: `-90 ≤ lat ≤ 90`
- Longitud: `-180 ≤ lon ≤ 180`
- No aceptar: `null`, `undefined`, `NaN`, `Infinity`, tipos no-número

**Retorna:** `true` si válidas, `false` si inválidas

```javascript
function isValidCoordinates(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number') return false;
    if (isNaN(lat) || isNaN(lon)) return false;
    if (!isFinite(lat) || !isFinite(lon)) return false;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;
    return true;
}
```

#### 6. `addToSearchHistory(cityName)`
**Propósito:** Guardar búsquedas recientes en localStorage  
**Datos almacenados:** Máximo 10 ciudades, sin duplicados  
**Persistencia:** localStorage clave `'searchHistory'`

```javascript
function addToSearchHistory(cityName) {
    searchHistory = searchHistory.filter(city => city !== cityName);
    searchHistory.unshift(cityName);
    if (searchHistory.length > 10) searchHistory.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}
```

#### 7. `displaySearchHistory()`
**Propósito:** Mostrar botones de búsquedas recientes en UI  
**Ubicación:** Div `#history` bajo el botón de búsqueda  
**Interacción:** Click en botón → busca esa ciudad

```javascript
// Genera: [Santiago] [Madrid] [Tokyo] ...
```

#### 8. `toggleTheme()`
**Propósito:** Cambiar entre modo claro/oscuro  
**Persistencia:** localStorage clave `'theme'`  
**Default:** `'light'` si no existe preferencia

```javascript
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
    updateThemeButton();
}
```

#### 9. `applyTheme(theme)`
**Propósito:** Aplicar estilos CSS del tema elegido  
**Modifica:** Atributo `data-bs-theme` en `<html>`  
**Estilos:** Definidos en `styles.css` con variables CSS

```javascript
function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#0d0d0d' : '#e0f7f7';
}
```

#### 10. `updateThemeButton()`
**Propósito:** Cambiar texto del botón según tema actual  
**Botón:** `#themeToggle`  
**Textos:** "🌙 Oscuro" (modo light) ↔ "☀️ Claro" (modo dark)

#### 11. `checkWeatherAlerts(weatherCode, windSpeed, rainProb)`
**Propósito:** Detectar condiciones climáticas peligrosas  
**Niveles de alerta:**
- 🔴 **PELIGRO:** Tormentas (WMO ≥95) o vientos >80 km/h
- 🟠 **ADVERTENCIA:** Vientos 60-80 km/h o lluvia >90%
- 🔵 **INFO:** Información general

```javascript
if (weatherCode >= 95) showWeatherAlert("⚠️ TORMENTA EXTREMA", "danger");
```

#### 12. `showWeatherAlert(msg, level)`
**Propósito:** Mostrar alerta meteorológica en UI  
**Bootstrap alert:** Dismissible (botón X para cerrar)  
**Niveles:** `'danger'`, `'warning'`, `'info'`

#### 13. `displayForecast(forecastData)`
**Propósito:** Mostrar pronóstico de 7 días en grid responsive  
**Layout:** Bootstrap grid cols 12/6/4/3 (mobile/tablet/desktop)  
**Per-día muestra:** Nombre día, fecha, emoji condición, temp máx/mín, lluvia %

```javascript
// Genera tarjetas: Hoy | Mañana | +2 | +3 | +4 | +5 | +6
// Cada una: max 25°C / min 18°C, 🌧️ 30%
```

---



### Flujo de Datos

```
┌──────────────────────────────────────────────────────┐
│              DOM (index.html)                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ #cityInput (input)                           │   │
│  │ #suggestions (div)                           │   │
│  │ #result (div)                                │   │
│  └──────────────────────────────────────────────┘   │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
      ┌────────────────────┐
      │  script.js         │
      │  Lógica principal  │
      └────────┬───────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌────────────┐
   │ Debounce│   │ Validación │
   │ 400ms   │   │ Coordenadas│
   └────┬────┘   └─────┬──────┘
        │              │
        ▼              ▼
┌─────────────────────────────────────┐
│      APIs Open-Meteo                │
├─────────────────────────────────────┤
│ 1. Geocoding API (búsqueda ciudades)│
│ 2. Weather API (datos climáticos)   │
└─────────────────────────────────────┘
```

### Manejo de Errores

```
try {
    // 1. Validar entrada
    if (!input && !lat) {
        showError("⚠️ Ingresa una ciudad");
        return;
    }
    
    // 2. Búsqueda geocoding
    if (!lat || !lon) {
        const response = await fetch(geocodingAPI);
        if (!response.results || response.results.length === 0) {
            showError("❌ Ciudad no encontrada");
            return;
        }
    }
    
    // 3. Validar coordenadas
    if (!isValidCoordinates(lat, lon)) {
        showError("⚠️ Coordenadas inválidas");
        return;
    }
    
    // 4. Llamar API clima
    const weatherResponse = await fetch(weatherAPI);
    
    // 5. Procesar y mostrar
    displayWeather(data);
    
} catch (error) {
    console.error("Error general:", error);
    showError("⚠️ Error al obtener el clima");
}
```

---

## 🔮 Posibles Mejoras

#### 1. **Geolocalización Automática** 
```javascript
function getGeoLocation() {
    // Pide permiso al usuario
    // Obtiene lat/lon del navegador
    // Reverse geocoding: coordenadas → nombre ciudad
    // Llama getWeather() automáticamente
}
```

#### 2. **Compartir en Redes** 
```javascript
function shareWeather(cityName, temp, condition) {
    // Genera URLs pre-llenadas para:
    // - Twitter
    // - WhatsApp
    // - Facebook
}
```

#### 3. **Progressive Web App (PWA)**
- Funcionar offline
- Instalar como app mobile
- Push notifications

#### 4. **Backend Propio**
- API propia en Node.js/Express
- Base de datos con ciudades
- Rate limiting para producción

#### 5. **Multi-idioma**
- Traductor de descripciones climáticas
- Soporte para 5+ idiomas

#### 6. **Mapas Interactivos**
- Integrar Leaflet.js o Mapbox
- Mostrar clima en mapa
- Click en ubicación

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Ejecutar todos los tests
npm test

# Modo observador (re-ejecuta al guardar)
npm test -- --watch

# Ver cobertura (% de código testeado)
npm test -- --coverage
```

### Estructura de Tests (130+ casos)

```
✅ Códigos de Clima WMO: 29 tests
   - Cielo despejado (1)
   - Niebla (2)
   - Lluvia (3)
   - Nieve (3)
   - Tormentas (3)
   ... etc

🧭 Validación de Coordenadas: 14 tests
   - Límites extremos
   - Valores inválidos
   - Tipos de datos incorrectos

🌍 API Geocoding: 5 tests
   - Response vacío
   - Múltiples resultados
   - Sin datos de país

🌤️ API Clima: 8 tests
   - Temperaturas extremas
   - Diferencias mín/máx
   - Vientos extremos

💧 Precipitación: 4 tests
❌ Errores: 4 tests
📝 Entrada: 10 tests
🔄 Integración: 5 tests
... más tests
```

### Escribir Nuevos Tests

```javascript
// Ejemplo: Test para nueva funcionalidad
test(\"TC-NEW: Historial de búsquedas se guarda en localStorage\", () => {
    const city = \"Santiago\";
    addToSearchHistory(city);
    
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    expect(searchHistory).toContain(\"Santiago\");
});
```

---

## 🐛 Troubleshooting (posibles problemas al instalar la APP)

### Problema 1: "npm: command not found"
**Causa:** Node.js no está instalado  
**Solución:**
1. Descargar desde https://nodejs.org/
2. Instalar (incluye npm automáticamente)
3. Reiniciar terminal

### Problema 2: "Ciudad no encontrada" en ciudades válidas
**Causa:** Problema de conexión a Open-Meteo  
**Solución:**
1. Verificar conexión a internet
2. Verificar que Open-Meteo esté disponible
3. Probar en navegador private/incógnito

### Problema 3: Tests fallan con "Cannot find module"
**Causa:** Dependencias no instaladas  
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

### Problema 4: UI no se actualiza después de búsqueda
**Causa:** JavaScript deshabilitado o error en consola  
**Solución:**
1. Abrir DevTools (F12)
2. Ir a Console
3. Ver errores
4. Verificar que JavaScript esté habilitado

### Problema 5: Autocompletado muy lento
**Causa:** Debounce de 400ms muy alto  
**Modificar en script.js:**
```javascript
// Cambiar de 400 a 200ms
timeout = setTimeout(() => {
    fetchSuggestions();
}, 200);  // ← Aquí
```

---

## 📚 Recursos Útiles

### Documentación Oficial
- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [Jest Testing Docs](https://jestjs.io/docs/getting-started)
- [MDN Web Docs](https://developer.mozilla.org/)

### Herramientas Recomendadas
- **VS Code** - Editor de código
- **DevTools del Navegador** (F12) - Debug
- **Postman** - Testear APIs manualmente
- **Git** - Versionamiento

### Códigos WMO Completos
[https://en.wikipedia.org/wiki/Present_weather#Present_weather_codes](https://en.wikipedia.org/wiki/Present_weather#Present_weather_codes)

---

## 👤 Contribuir

Para agregar mejoras:

```bash
# 1. Crear rama nueva
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios

# 3. Crear tests para cambios
# (Agregar en script.test.js)

# 4. Ejecutar tests
npm test

# 5. Si todo pasa: commit
git add .
git commit -m "feat: nueva-funcionalidad"

# 6. Push a rama
git push origin feature/nueva-funcionalidad
```

---

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir.

---

## 📞 Soporte

Para problemas:
1. Revisar sección [Troubleshooting](#troubleshooting)
2. Chequear error en DevTools (F12 → Console)
3. Verificar que APIs de Open-Meteo estén disponibles
4. Leer documentación de Open-Meteo

---

**Última actualización:** Abril 12, 2026  
**Versión:** 1.0.0  
**Estado:** Beta (Producción)

---

## 🚀 Quick Start (Cómo instalar: Para Impacientes)

```bash
# 1. Instalar
npm install

# 2. Testear
npm test

# 3. Abrir
start index.html

# 4. Buscar ciudad
# Escribe "Santiago" en el input
# ¡Listo! 🎉
```
