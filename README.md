# Sistema de Gestión Logística – Vallado

## 1. Descripción general del sistema

El Sistema de Gestión Logística – Vallado es una aplicación web desarrollada para la administración integral de una empresa del rubro logístico. Su objetivo principal es centralizar la gestión de recursos, operaciones y control de inventario en una única plataforma digital.

El sistema permite la administración de usuarios, empleados, camiones, vallas, stock, movimientos y ubicaciones, mediante una interfaz web modular basada en JavaScript.

---

## 2. Tecnologías utilizadas

El desarrollo del sistema se realizó utilizando las siguientes tecnologías:

- HTML5 para la estructura de la interfaz.
- CSS3 para el diseño visual.
- JavaScript (ES Modules) para la lógica de la aplicación.
- Fetch API para la comunicación con el backend.
- LocalStorage para la gestión de sesión del usuario.

---

## 3. Arquitectura del sistema

El sistema se organiza bajo una arquitectura modular, donde cada entidad del dominio se encuentra separada en módulos independientes ubicados en la carpeta de vistas.

Cada módulo contiene su propia lógica de CRUD, permitiendo escalabilidad y mantenimiento independiente.

---

## 4. Autenticación y control de sesión

El sistema implementa un mecanismo de autenticación basado en token.

Al iniciar sesión, se almacenan en el navegador:

- Token de autenticación
- Información del usuario

Comportamiento del sistema:

- Si existe una sesión activa, el sistema ingresa automáticamente a la aplicación.
- Si no existe sesión, se redirige al usuario a la pantalla de login.

---

## 5. Dashboard

El dashboard cumple una función de acceso rápido a los distintos módulos del sistema.

No representa un resumen general de entidades como camiones o empleados.

Está compuesto por tarjetas de acceso directo a los siguientes módulos:

- Camiones
- Vallas
- Empleados
- Stock
- Ubicaciones
- Movimientos
- Usuarios (solo disponible para rol administrador)

Además, el dashboard incluye un resumen específico del inventario de vallas, compuesto por:

- Total general de vallas
- Cantidad de vallas agrupadas por tipo o descripción

---

## 6. Módulos del sistema

### 6.1 Usuarios
Módulo destinado a la gestión de usuarios del sistema. Permite crear, editar, eliminar y listar usuarios. El acceso a este módulo está restringido únicamente al rol administrador.

### 6.2 Empleados
Permite la gestión del personal de la empresa. Incluye alta, baja, modificación y consulta de empleados con validación de datos como DNI y legajo.

### 6.3 Camiones
Módulo destinado a la administración de la flota de vehículos.

### 6.4 Vallas
Gestión del inventario de vallas disponibles en la empresa.

### 6.5 Stock
Control general de inventario del sistema.

### 6.6 Movimientos
Registro de entradas y salidas de materiales o recursos.

### 6.7 Ubicaciones
Gestión de ubicaciones físicas utilizadas en las operaciones logísticas.

---

## 7. Componentes reutilizables

### Tabla dinámica (renderTable)
El sistema incluye un componente reutilizable para la generación de tablas dinámicas.

Este componente permite:

- Ordenamiento por columnas
- Búsqueda en tiempo real
- Acciones dinámicas por fila (ver, editar, eliminar)

---

## 8. Control de roles

El sistema implementa control de acceso basado en roles:

- Administrador: acceso completo a todos los módulos.
- Usuario estándar: acceso limitado a módulos operativos.

---

## 9. Flujo general de la aplicación

El flujo de la aplicación es el siguiente:

1. Inicio de sesión del usuario.
2. Validación de credenciales y generación de sesión.
3. Redirección automática según estado de sesión:
   - Sesión activa: ingreso directo a la aplicación.
   - Sin sesión: redirección a login.
4. Acceso al dashboard como punto central de navegación.
5. Navegación hacia módulos mediante menú lateral o tarjetas de acceso.

---

## 10. Mejoras futuras

Se contemplan las siguientes mejoras para futuras versiones del sistema:

- Implementación de ubicaciones jerárquicas, permitiendo subdividir cada ubicación en múltiples sectores o puntos internos.
- Ampliación del control de stock por ubicación específica.
- Registro de auditoría de acciones por usuario.
- Implementación de métricas y gráficos para el dashboard.