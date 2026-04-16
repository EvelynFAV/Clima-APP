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
git clone https://github.com/EvelynFAV/Clima-APP.git
cd App-Clima

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

Abre el archivo `src/index.html` directamente en tu navegador:

```bash
# En Windows
start src/index.html

# En macOS
open src/index.html

# En Linux
xdg-open src/index.html
```

O simplemente navega a la carpeta `src/` y haz doble clic en `index.html`.
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

### Funciones Principales - Orden de Ejecución

#### 1. `showSuggestions()` 
**Propósito:** Activar búsqueda con debounce  
**Desencadenante:** Evento `oninput` en campo de búsqueda  
**Lógica:**
- Limpia timeout anterior
- Espera 400ms sin nueva entrada antes de llamar `fetchSuggestions()`
- Optimiza: evita llamadas excesivas a la API

#### 2. `fetchSuggestions()`
**Propósito:** Obtener sugerencias de ciudades mientras el usuario escribe  
**API:** `https://geocoding-api.open-meteo.com/v1/search`  
**Validaciones:**
- Mínimo 2 caracteres de entrada
- Solo permite letras, acentos, espacios y guiones (seguridad XSS)
- Si error: muestra mensaje de error sin bloquear UI

#### 3. `getCoordinatesFromCity(cityName)`
**Propósito:** Convertir nombre de ciudad a coordenadas geográficas  
**API:** `https://geocoding-api.open-meteo.com/v1/search`  
**Retorna:** `{ latitude, longitude, name, country }`
**Errores:** Lanza excepción si ciudad no existe o hay error de API

#### 4. `fetchWeatherData(lat, lon)`
**Propósito:** Obtener datos del clima actual y pronóstico de 7 días  
**API:** `https://api.open-meteo.com/v1/forecast`  
**Retorna:** Objeto con `current_weather` (temp, viento, código) y `daily` (7 días de pronóstico)

#### 5. `getWeather(lat, lon, cityName, country)` ⭐
**Propósito:** Función principal que orquesta toda la búsqueda (PUNTO DE ENTRADA)  
**Flujo executado:**
1. Valida entrada
2. Obtiene coordenadas si no existen
3. Valida coordenadas con `isValidCoordinates()`
4. Guarda en historial
5. Obtiene clima con `fetchWeatherData()`
6. Verifica alertas
7. Renderiza resultados

#### 6. `interpretWeather(code)`
**Propósito:** Convertir código WMO a descripción legible con emoji
**Entrada:** Código numérico (0-99)
**Salida:** String con emoji (ej: "☀️ Cielo despejado")

#### 7. `isValidCoordinates(lat, lon)`
**Propósito:** Validar que coordenadas sean válidas para el planeta Tierra
**Validaciones:** tipo number, no NaN, no Infinity, rangos geográficos
**Retorna:** `true` si válidas, `false` si no

#### 8. `addToSearchHistory(cityName)`
**Propósito:** Guardar búsqueda reciente en localStorage
**Reglas:** Máximo 10, sin duplicados, más recientes primero
**Almacenamiento:** localStorage clave `'searchHistory'`

#### 9. `displaySearchHistory()`
**Propósito:** Renderizar botones de búsquedas recientes en UI
**Ubicación:** Div `#history`
**Interacción:** Click en botón → ejecuta `getWeather()` con esa ciudad

#### 10. `renderWeatherResults(weatherData, cityName, country)`
**Propósito:** Componer HTML con datos del clima actual
**Retorna:** String HTML con temp actual, máxima, mínima, viento, estado, + pronóstico

#### 11. `displayForecast(forecastData)`
**Propósito:** Generar HTML para pronóstico de 7 días en grid responsivo
**Layout:** Mobile 2 cols, Tablet 3 cols, Desktop 4 cols
**Por día:** nombre, fecha, emoji condición, temp máx/mín, lluvia %

#### 12. `checkWeatherAlerts(weatherCode, windSpeed, rainProb)`
**Propósito:** Detectar condiciones climáticas peligrosas
**Reglas:** Tormenta, Precipitación extrema, Vendaval, Vientos fuertes, Lluvia intensa
**Efecto:** Si coincide una regla, llama `showWeatherAlert()`

#### 13. `showWeatherAlert(msg, level)`
**Propósito:** Mostrar alerta meteorológica en UI
**Entrada:** msg (string), level (`'danger'` | `'warning'` | `'info'`)
**Características:** Bootstrap dismissible, se inserta encima de resultados

#### 14. `showError(message)`
**Propósito:** Mostrar mensaje de error al usuario
**Ubicación:** Div `#result`
**Estilo:** Texto rojo con emoji ⚠️

#### 15. `toggleTheme()`
**Propósito:** Alternar entre modo light/dark
**Persistencia:** localStorage clave `'theme'`
**Flujo:** Alterna tema → guarda → aplica cambios → actualiza botón

#### 16. `applyTheme(theme)`
**Propósito:** Aplicar estilos CSS del tema elegido
**Cambios:** Atributo `data-bs-theme` en `<html>`, color fondo body

#### 17. `updateThemeButton()`
**Propósito:** Actualizar texto del botón de tema
**Ubicación:** Elemento `#themeToggle`
**Textos:** "🌙 Oscuro" (light mode) | "☀️ Claro" (dark mode)

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
