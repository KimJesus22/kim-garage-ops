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

## 🎨 Diseño y Estética (COD MW)
- **Modo Oscuro Profundo**: Paleta de colores `cod-dark` y `cod-darker` para reducir fatiga visual.
- **Acentos Neón**: Verde (`#4ade80`) para estados positivos y Naranja (`#ff6b35`) para alertas.
- **Tipografía Militar**: Uso de fuentes `Rajdhani` y `Inter` con tracking amplio.
- **Micro-interacciones**: Efectos de sonido (visuales), bordes brillantes y transiciones suaves.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
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
├── components/      # Componentes reutilizables (Cards, Forms, Sidebar)
├── context/         # Estado global (VehicleContext)
├── pages/           # Vistas principales (Dashboard, Garage, Historial)
├── index.css        # Configuración de Tailwind y estilos base
└── main.jsx         # Punto de entrada
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir cambios o mejoras.

---
Desarrollado con ❤️ y estilo táctico.
