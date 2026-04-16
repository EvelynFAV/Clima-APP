# Clima-APP
Aplicación que entrega información del Clima según la ciudad de búqueda.
## 🎯 Resumen del Proyecto

**App Clima GPT** es una aplicación web que permite a los usuarios consultar información meteorológica en tiempo real de cualquier ciudad del mundo. 

### Características Principales
- ✅ **Búsqueda de ciudades** con autocompletado inteligente
- ✅ **Información meteorológica completa**: temperatura actual, máxima/mínima, velocidad del viento y estado climático (Despejado, nublado, parcialmente nublado, niebla, lluvioso, nieve, tormenta, entre otros.)
- ✅ **Interpretación de códigos WMO** (estándares internacionales de clima): Estos códigos son los que nos entregan el estado del clima de cada ciudad y los trae la API de Open - Meteo.
- ✅ Manejo robusto de errores y validación de datos: Maneja errores de conexión con la API, errores de validación en los inputs (vacíos, ciudades no existentes, entre otros)
- ✅ **Interfaz responsiva** con Bootstrap 5
- ✅ **Debounce de búsqueda** para optimizar llamadas a API (400ms). Esto se implementa para evitar que el autocompletado que se le entrega al usuario, haga demasiadas llamadas a la API, pues de esta forma sería menos eficiente la aplicación. 
