# `mycn18-studio-ui-landing`

## Sitio Web de Marketing y Adquisición (Astro)

[](https://astro.build/)
[](https://web.dev/vitals/)

-----

## Descripción del Microservicio (Uso Interno)

El repositorio `mycn18-ui-landing` contiene la *landing page* pública del Studio. Este sitio está diseñado para un único propósito: ser **el sitio web más rápido posible** para maximizar la conversión y el posicionamiento en buscadores.

Utiliza el *framework* **Astro** para renderizar la mayor parte del contenido como **HTML puro** durante la fase de *build*, eliminando el JavaScript innecesario en el lado del cliente (hidratación parcial).

**Funciones Clave:**

  * **Velocidad:** Rendimiento líder en la industria para el *Initial Load*.
  * **SEO:** Código fuente limpio y optimizado para los *crawlers* de búsqueda.
  * **Integración Parcial:** Utiliza "Islas" de React para la funcionalidad interactiva esencial (ej. formularios) sin sacrificar la velocidad del sitio estático.

-----

## Especificaciones Operacionales

| Parámetro | Valor Óptimo | Notas |
| :--- | :--- | :--- |
| **Framework Base** | Astro | Enfocado en contenido estático y *content-heavy* sites. |
| **Framework UI** | React | Usado exclusivamente para componentes interactivos (*Islas*). |
| **Filosofía** | Zero JS por Defecto | Solo se envía JS al cliente donde es estrictamente necesario. |
| **Despliegue** | CDN / Serverless Static Host | Mínimo tiempo de respuesta global. |

-----

## Despliegue y Acceso

El producto final es un conjunto de archivos estáticos que se sirven fácilmente desde cualquier CDN.

### 1\. Variables de Entorno Clave

| Variable | Propósito |
| :--- | :--- |
| `PUBLIC_STUDIO_APP_URL` | URL de la aplicación Studio para el botón CTA ("Launch App"). |
| `PUBLIC_MARKETPLACE_APP_URL` | URL de la aplicación Marketplace para el botón CTA ("Go to Marketplace"). |
| `API_SIGNUP_ENDPOINT` | URL del endpoint de registro del servicio IAM (usado por el formulario). |

### 2\. Comandos de Compilación (Build)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar artefactos de producción (carpeta /dist)
npm run build
```
