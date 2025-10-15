# 📝 Accenture Todo Application

Una aplicación moderna de gestión de tareas desarrollada con Angular 20 y Angular Material. Esta aplicación permite crear, organizar y gestionar tareas de manera eficiente con un sistema de categorías personalizable.

## ✨ Características

- 🎯 **Gestión de Tareas**: Crear, editar, eliminar y marcar tareas como completadas
- 📂 **Sistema de Categorías**: Organizar tareas por categorías con colores personalizados
- 🔍 **Búsqueda y Filtros**: Buscar tareas por título/descripción y filtrar por categorías
- 📊 **Estadísticas**: Contadores en tiempo real de tareas totales, completadas y pendientes
- 💾 **Persistencia Local**: Los datos se guardan automáticamente en el navegador
- 📱 **Interfaz Responsiva**: Diseño moderno con Angular Material
- 🌙 **Tema Oscuro**: Soporte para tema oscuro de Material Design

## 🛠️ Tecnologías Utilizadas

- **Angular 20.2.1** - Framework principal
- **Angular Material 20.2.8** - Componentes UI
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **LocalStorage** - Persistencia de datos

## 📋 Prerrequisitos

Antes de instalar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior)
- **npm** (viene incluido con Node.js)
- **Angular CLI** (`npm install -g @angular/cli`)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd accentureTodo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo
```bash
npm start
# o alternativamente
ng serve
```

### 4. Abrir la aplicación
Una vez que el servidor esté corriendo, abre tu navegador y navega a:
```
http://localhost:4200
```

## 📖 Uso de la Aplicación

### Crear una Nueva Tarea
1. Haz clic en el botón **"+"** (Nueva tarea) en la barra superior
2. Completa el formulario con:
   - **Título** (requerido)
   - **Descripción** (opcional)
   - **Categoría** (opcional)
3. Haz clic en **"Crear Tarea"**

### Gestionar Categorías
1. Haz clic en el botón de carpeta **"Nueva categoría"**
2. Crea categorías personalizadas con colores únicos
3. Asigna categorías a tus tareas para mejor organización

### Funcionalidades Disponibles
- ✅ **Marcar tareas como completadas** - Haz clic en el checkbox
- ✏️ **Editar tareas** - Usa el botón de editar en cada tarea
- 🗑️ **Eliminar tareas** - Usa el botón de eliminar
- 🔍 **Buscar tareas** - Usa el campo de búsqueda
- 🔽 **Filtrar por categoría** - Selecciona una categoría del dropdown

## 🏗️ Estructura del Proyecto

```
accentureTodo/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la aplicación
│   │   │   ├── category-manager/    # Gestión de categorías
│   │   │   ├── task-form/          # Formulario de tareas
│   │   │   └── todo-container/     # Contenedor principal
│   │   ├── models/              # Modelos de datos
│   │   │   ├── category.model.ts
│   │   │   └── task.model.ts
│   │   ├── services/            # Servicios
│   │   │   └── storage.service.ts   # Gestión de datos
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── styles.scss              # Estilos globales
│   └── index.html               # Página principal
├── node_modules/                # Dependencias
├── package.json                 # Configuración del proyecto
└── README.md                    # Este archivo
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Verificar código
npm run watch
```

### Arquitectura

La aplicación utiliza un patrón de arquitectura basado en señales (signals) de Angular:

- **StorageService**: Maneja el estado global y la persistencia
- **TodoContainerComponent**: Componente principal que coordina la aplicación
- **TaskFormComponent**: Maneja la creación y edición de tareas
- **CategoryManagerComponent**: Gestiona las categorías
### Debugging

Si encuentras problemas, activa los logs de consola para debugging:

```typescript
// Los logs están incluidos en el código para facilitar el debugging
console.log('Componente - Acción realizada:', datos);
```