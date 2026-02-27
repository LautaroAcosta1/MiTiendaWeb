# MiTiendaWeb

Plataforma web full-stack para la creación y administración de tiendas online con catálogo público y panel de configuración.

## Demo en producción

Frontend: https://mi-tienda-web-eta.vercel.app/  
Backend API: https://mitiendaweb.onrender.com  

---

## Descripción

MiTiendaWeb es una aplicación SaaS que permite a los usuarios:

- Registrarse e iniciar sesión
- Crear y administrar su propia tienda
- Configurar nombre y mensaje de WhatsApp
- Visualizar un catálogo público mediante slug personalizado
- Subir imágenes mediante Cloudinary
- Gestionar configuración desde panel admin

Cada tienda tiene su propia URL dinámica basada en slug.

---

## Arquitectura

La aplicación está separada en:

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Deploy en Vercel

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Deploy en Render

### Servicios externos
- Cloudinary (almacenamiento de imágenes)

---

## Autenticación

Se utiliza autenticación basada en JWT.

Flujo:
1. Usuario inicia sesión
2. Backend genera token
3. Token se guarda en localStorage
4. Se envía en headers para rutas protegidas

---

## Objetivo del Proyecto

Este proyecto fue desarrollado como práctica avanzada de:

- Arquitectura full-stack
- Autenticación JWT
- Deploy en servicios cloud
- Manejo de rutas dinámicas
- Integración con servicios externos

---

## Autor

Desarrollado por Lautaro Fernando Acosta

Si te interesa el proyecto o querés contactarme:
- LinkedIn: https://www.linkedin.com/in/lautaro-fernando-acosta-a013b1283/
- Email: acostalauty765@gmail.com 

---
