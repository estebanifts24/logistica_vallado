# Sistema de Gestión Logística – Vallado

## Descripción General

El Sistema de Gestión Logística – Vallado es una aplicación web desarrollada para centralizar y administrar los recursos operativos de una empresa dedicada a la logística y gestión de vallado.

La plataforma permite gestionar usuarios, empleados, camiones, vallas, stock, movimientos y ubicaciones desde una única interfaz, proporcionando control de acceso por roles, persistencia de datos en la nube y validaciones tanto en cliente como en servidor.

El objetivo principal del sistema es optimizar la administración de recursos, mejorar la trazabilidad de las operaciones y garantizar la integridad de la información almacenada.

---

## Objetivos del Proyecto

* Centralizar la administración de recursos logísticos.
* Controlar el inventario de vallas disponible.
* Gestionar movimientos de ingreso y egreso de materiales.
* Administrar empleados, camiones y ubicaciones.
* Implementar autenticación y autorización de usuarios.
* Mantener consistencia entre operaciones e inventario.
* Aplicar una arquitectura modular y escalable.

---

## Tecnologías Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (ES Modules)
* Fetch API
* LocalStorage

### Backend

* Node.js
* Express.js
* JWT (JSON Web Token)
* bcrypt

### Base de Datos

* Firebase Cloud Firestore

### Infraestructura

* Arquitectura cliente-servidor
* API REST
* Persistencia en la nube mediante Firestore

### Despliegue previsto

* Frontend: Vercel
* Backend: Vercel
* Base de datos: Firebase Cloud Firestore

---

## Arquitectura del Sistema

El proyecto se encuentra dividido en dos grandes componentes: Frontend y Backend.

### Frontend

Implementado como una Single Page Application (SPA) utilizando JavaScript puro.

Responsabilidades:

* Interfaz gráfica de usuario.
* Gestión de navegación.
* Renderizado dinámico de vistas.
* Validaciones de entrada.
* Consumo de la API REST.
* Gestión de sesión mediante token.

### Backend

Implementado mediante Node.js y Express.

El backend se encuentra organizado en capas para mejorar la mantenibilidad y escalabilidad del sistema.

#### Routes

Definen los endpoints disponibles de la API.

#### Controllers

Reciben las solicitudes HTTP y coordinan las operaciones correspondientes.

#### Services

Implementan las reglas de negocio y procesos internos.

#### Models

Gestionan el acceso y la interacción con Firestore.

#### Middlewares

Se encargan de funcionalidades transversales:

* Validación de token.
* Control de acceso por roles.
* Manejo de errores.
* Protección de rutas privadas.

---

## Base de Datos

El sistema utiliza Firebase Cloud Firestore como base de datos NoSQL.

Las principales colecciones administradas son:

* Usuarios
* Empleados
* Camiones
* Vallas
* Stock
* Movimientos
* Ubicaciones

Toda la información operativa se almacena y consulta directamente desde Firestore.

Esto permite que cualquier modificación realizada sobre la base de datos sea reflejada automáticamente por la aplicación en las siguientes consultas realizadas al sistema.

---

## Autenticación y Seguridad

El acceso a la aplicación requiere autenticación previa.

Durante el proceso de inicio de sesión:

1. El usuario ingresa sus credenciales.
2. El backend valida la información.
3. Se genera un JWT.
4. El token es almacenado en LocalStorage.
5. Se habilita el acceso a los módulos autorizados según el rol.

### Gestión de sesión

* Si existe una sesión válida, el usuario ingresa automáticamente al sistema.
* Si no existe sesión activa, el sistema redirige al login.

### Seguridad implementada

* Contraseñas almacenadas mediante hash utilizando bcrypt.
* Protección de rutas mediante JWT.
* Control de acceso basado en roles.
* Restricción de módulos según permisos asignados.

---

## Dashboard

El dashboard constituye la pantalla principal de la aplicación.

Su función principal es actuar como punto central de navegación mediante tarjetas de acceso directo a los distintos módulos.

Los accesos disponibles son:

* Usuarios
* Empleados
* Camiones
* Vallas
* Stock
* Movimientos
* Ubicaciones

El módulo de usuarios se encuentra disponible únicamente para usuarios con rol administrador.

### Resumen de inventario

Además de la navegación, el dashboard presenta un resumen del inventario de vallas:

* Total general de vallas.
* Cantidad agrupada por tipo de valla.

---

## Módulos del Sistema

### Usuarios

Permite la administración de usuarios del sistema.

Funciones:

* Alta de usuarios.
* Edición de usuarios.
* Eliminación de usuarios.
* Consulta de usuarios.
* Gestión de roles.

---

### Empleados

Permite la administración del personal.

Funciones:

* Alta de empleados.
* Edición de empleados.
* Eliminación de empleados.
* Consulta de empleados.

Validaciones implementadas:

* Campos obligatorios.
* DNI válido.
* DNI duplicado.
* Legajo duplicado.

---

### Camiones

Administración de la flota de vehículos.

Funciones:

* Alta.
* Edición.
* Eliminación.
* Consulta.

---

### Vallas

Administración de los tipos de vallas disponibles.

Funciones:

* Alta.
* Edición.
* Eliminación.
* Consulta.

---

### Stock

Control del inventario disponible.

Funciones:

* Consulta de existencias.
* Visualización de cantidades por tipo de valla.
* Actualización automática a partir de movimientos registrados.

---

### Movimientos

Registro de operaciones logísticas realizadas sobre el inventario.

Funciones:

* Alta de movimientos.
* Consulta histórica.
* Actualización automática del stock.

### Integración con inventario

Cada movimiento registrado impacta directamente sobre el inventario almacenado en Firestore.

Antes de ejecutar una operación, el sistema verifica la disponibilidad de stock cuando corresponde, garantizando la consistencia de los datos.

---

### Ubicaciones

Administración de ubicaciones físicas.

Funciones:

* Alta.
* Edición.
* Eliminación.
* Consulta.

---

## Componentes Reutilizables

### renderTable

Componente reutilizable utilizado para la generación dinámica de tablas.

Características:

* Ordenamiento por columnas.
* Búsqueda en tiempo real.
* Acciones dinámicas por fila.
* Reutilización en múltiples módulos.

---

## Validaciones Implementadas

El sistema incorpora validaciones tanto en frontend como en backend.

### Frontend

* Campos obligatorios.
* Validación de DNI.
* Validación de legajo.
* Control de formatos.
* Mensajes de error inmediatos.

### Backend

* Validación de autenticación.
* Validación de autorización.
* Control de acceso por roles.
* Integridad de operaciones sobre stock.
* Protección de recursos mediante JWT.

---

## Flujo General de Funcionamiento

1. Inicio de sesión.
2. Validación de credenciales.
3. Generación de token JWT.
4. Acceso al dashboard.
5. Navegación mediante menú lateral o tarjetas.
6. Interacción con módulos.
7. Consumo de API REST.
8. Persistencia de información en Firestore.
9. Actualización automática de datos visualizados.

---

## Mejoras Futuras

Las futuras versiones del sistema podrán incorporar:

* Ubicaciones jerárquicas con múltiples sectores internos.
* Control de stock por sector o ubicación específica.
* Auditoría de acciones realizadas por usuario.
* Reportes operativos.
* Dashboard con indicadores y métricas avanzadas.
* Estadísticas de movimientos e inventario.
* Optimización para dispositivos móviles.
* Implementación productiva mediante despliegue en Vercel.

---

## Conclusión

El Sistema de Gestión Logística – Vallado fue desarrollado utilizando una arquitectura modular basada en tecnologías web modernas.

La separación entre frontend y backend, el uso de JWT para autenticación, la persistencia mediante Cloud Firestore y la organización interna en capas permiten obtener una solución mantenible, escalable y preparada para futuras ampliaciones funcionales.

El sistema centraliza la gestión operativa de la organización y proporciona herramientas para el control de inventario, trazabilidad de movimientos y administración de recursos logísticos.
