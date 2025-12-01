# 🚗 Garage Ops - Vehicle Manager (Estilo COD MW)

![Dashboard Preview](https://i.imgur.com/placeholder.png) *Nota: Reemplaza esto con una captura real de tu dashboard*

Una aplicación web moderna para la gestión integral de vehículos (autos y motos), diseñada con una estética inmersiva inspirada en los menús de **Call of Duty: Modern Warfare**. Combina funcionalidad robusta con una experiencia de usuario premium en modo oscuro.

## ✨ Características Principales

### 🎯 Dashboard Interactivo
- Vista general del estado de tu garage.
- Métricas clave: Vehículos activos, gasto total, alertas de mantenimiento.
- Acceso rápido a las funciones más importantes.

### 🏎️ Gestión de Garage
- **Registro de Vehículos**: Agrega autos y motos con detalles completos (marca, modelo, año, foto).
- **Edición Rápida**: Actualiza el kilometraje directamente desde la tarjeta del vehículo.
- **Identificación Visual**: Iconos y colores distintivos para cada tipo de vehículo.

### 🔧 Sistema de Mantenimiento Inteligente
- **Registro de Servicios**: Guarda historial de cambios de aceite, reparaciones, neumáticos, etc.
- **Alertas Automáticas**:
  - **Motos**: Aviso de servicio cada 5,000 km.
  - **Autos**: Aviso de servicio cada 10,000 km.
- **Notificaciones Urgentes**: Etiqueta "URGENTE" parpadeante cuando se excede el límite de servicio.

### 📊 Historial y Estadísticas
- Registro detallado de todos los servicios realizados con costos y fechas.
- Visualización clara de gastos y mantenimiento por vehículo.

### 🎨 Diseño y Estética (COD MW)
- **Modo Oscuro Profundo**: Paleta de colores `cod-dark` y `cod-darker` para reducir fatiga visual.
- **Acentos Neón**: Verde (`#4ade80`) para estados positivos y Naranja (`#ff6b35`) para alertas.
- **Tipografía Militar**: Uso de fuentes `Rajdhani` y `Inter` con tracking amplio.
- **Micro-interacciones**: Efectos de sonido (visuales), bordes brillantes y transiciones suaves.
- **Motion UI**: Transiciones de página fluidas y contadores animados para un "Game Feel" inmersivo.
- **Temas Dinámicos**: Personalización en tiempo real con temas Tactical (Verde), Blink (Rosa) y Army (Morado).

### 🚀 Nuevas Funcionalidades (v2.1)
- **Notification Hub**: Centro de alertas centralizado para stock bajo, servicios próximos y agenda del día.
- **Trip Simulator Táctico**: Mapa interactivo (Leaflet + CartoDB) para cálculo de distancias y estimación de costos de viaje.
- **Data Export**: Herramienta administrativa para descargar el historial completo de servicios en CSV compatible con Excel.
- **Feedback Sonoro (Web Audio API)**: Sistema de sonido inmersivo sin archivos externos (Click, Hover, Success, Error) con control de silencio.
- **Landing Page de Alto Impacto**: Entrada inmersiva con animaciones en cascada.
- **Sistema de Temas**: Selector flotante para cambiar la estética de la app al instante.
- **Etiquetado QR**: Generación de tarjetas de identificación con código QR para cada vehículo.
- **Evidencia Fotográfica**: Adjunta fotos comprimidas a los registros de servicio.
- **Eficiencia de Combustible**: Cálculo automático de Km/L y semáforo de rendimiento.
- **Escáner OCR (Nuevo)**: Escaneo inteligente de placas y VINs utilizando la cámara o imágenes, potenciado por `tesseract.js`.
- **Nuevos Módulos**:
    - **Calendario Táctico**: Programación visual de operaciones y mantenimientos.
    - **Estadísticas Avanzadas**: Análisis de tendencias de gastos y rendimiento.
    - **Configuración**: Ajustes del sistema y gestión de datos.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Enrutamiento**: [React Router](https://reactrouter.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Utilidades**: `jspdf`, `qrcode.react`, `html2canvas`
- **Estado**: React Context API + LocalStorage (Persistencia de datos)

## 🚀 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/KimJesus22/kim-garage-ops.git
    cd kim-garage-ops
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**
    ```bash
    npm run dev
    ```

4.  **Construir para producción**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (Cards, Forms, Sidebar, ThemeSelector)
├── context/         # Estado global (VehicleContext)
├── pages/           # Vistas principales (Landing, Dashboard, Garage, Historial, Schedule, Estadisticas, Configuracion)
├── index.css        # Configuración de Tailwind y variables CSS para temas
└── main.jsx         # Punto de entrada
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir cambios o mejoras.

---
Desarrollado con ❤️ y estilo táctico.
