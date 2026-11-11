# Modus Zero Landing

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/860df986-6601-49e9-9008-94c450d2c11c">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/7b93eba4-3961-4f24-9c02-c3a3f58bbadc">
    <img src="https://github.com/user-attachments/assets/7b93eba4-3961-4f24-9c02-c3a3f58bbadc" width="45%" />
  </picture>
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/828fd2e4-71d9-47c8-8b43-8c738ec773b5">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/40a440ac-3e57-4e7c-a34c-2e3e9622043a">
    <img src="https://github.com/user-attachments/assets/40a440ac-3e57-4e7c-a34c-2e3e9622043a" width="45%" />
  </picture>
</p>

## 🆕 v0.2.0

- **Pantalla de producto de Mod0 rehecha**: ahora explica el flujo real (mission control para sesiones de CLI con IA) con
  maquetas **interactivas en Svelte** (`src/components/ide/`) traducidas de los componentes del IDE, y capturas reales
  (`public/images/ide/{es,en}/`). Para regenerar las capturas: `python scripts/capture-screenshots.py` en el repo del IDE.
- **Rendimiento**: se eliminó el fondo de Vanta + three.js (CDN) con filtro `blur` de pantalla completa, que era la causa
  principal de la lentitud. Ahora es un `<canvas>` 2D propio que se detiene al hacer scroll, al ocultar la pestaña y con
  `prefers-reduced-motion`. El cursor personalizado solo se activa con ratón/trackpad y usa `gsap.quickTo`.
- **Stack**: Astro 7, `@astrojs/svelte` + React, Tailwind 4 vía `@tailwindcss/vite`, Node ≥ 22.23.4.
- `pricing`, sus textos y su configuración **no se tocaron**: siguen listos por si algún día se retoma.

## 🌐 Idioma / Language

> [!IMPORTANT]
>
> Esta documentación está disponible en dos idiomas.
>
> This documentation is available in two languages.
>
> * **[Español (Actual)](#description-es)**
>
> * **[English Version (Below)](#description-en)**
>
> * **[Manual (Al final | At the end)](#bilingual-manual)**

---
<br id="description-es">

# Versión en español

## Sitio Web de Marketing de Modus Zero

---

## Descripción del Proyecto

Este repositorio contiene la *landing page* oficial de **Modus Zero**, un ecosistema profesional diseñado para el aprovechamiento máximo de la **ingeniería agéntica**. A diferencia de los asistentes de chat tradicionales, este sitio presenta una visión donde la IA no solo asiste, sino que orquesta flujos de trabajo complejos mediante herramientas como **Mod0**.

El sitio está construido con **Astro** para garantizar una carga instantánea y un SEO impecable, permitiendo a los desarrolladores explorar el nuevo paradigma de "vibe coding" y orquestación de LLMs con la menor fricción posible.

**Puntos Clave del Ecosistema:**

* **Ingeniería Agéntica:** Enfoque en la verificación y revisión del trabajo de IA más que en la escritura manual de código.
* **Mod0:** Entorno autónomo con visualización de *Thinking Graphs* y tableros Kanban, entre otros elementos, ver más [aquí](github.com/ModusZero/mod0).
* **Local-First:** Soporte para inteligencia privada y modelos auto-hospedados.
* **Eficiencia:** Optimización de tokens mediante estrategias de inferencia por dificultad.

---

## Especificaciones Técnicas

| Parámetro | Valor | Notas |
| --- | --- | --- |
| **Framework Base** | Astro 5.0+ | Generación de sitios estáticos con Islas de interactividad. |
| **Arquitectura** | Local-first Ready | Preparado para integrarse con nodos de IA locales. |
| **UI Components** | Tailwind CSS + React | Estética minimalista con componentes interactivos de alta precisión. |
| **I18n** | Nativo (ES / EN) | Sistema de traducción dinámico basado en la URL. |
| **Despliegue** | GitHub Pages | Optimizado para entrega rápida vía CDN. |

---
<br id="description-en">

# English version

## Modus Zero Marketing Website

---

## Project Description

This repository hosts the official landing page for **Modus Zero**, a professional ecosystem tailored for maximizing the leverage of **agentic engineering**. Beyond simple chatbots, this platform introduces a workflow where AI orchestrates complex development tasks through tools like **Mod0**.

Built with **Astro**, the site ensures industry-leading performance and SEO, allowing developers to explore the "vibe coding" paradigm and LLM orchestration with zero friction.

**Ecosystem Key Features:**

* **Agentic Engineering:** Focus on verifying and auditing AI-generated work rather than manual coding.
* **Mod0:** Autonomous environment featuring *Thinking Graphs* and agentic Kanban boards, etc. see more [here](github.com/ModusZero/mod0).
* **Local-First:** Support for private intelligence and self-hosted models.
* **Token Efficiency:** Smart inference strategies to optimize costs and reasoning depth.

---

## Technical Specifications

| Parameter | Value | Notes |
| --- | --- | --- |
| **Base Framework** | Astro 5.0+ | Static site generation with interactive "Islands." |
| **Architecture** | Local-first Ready | Built to integrate with local AI nodes. |
| **UI Components** | Tailwind CSS + React | Minimalist aesthetic with high-precision components. |
| **I18n** | Native (EN / ES) | Dynamic translation system based on URL structure. |
| **Deployment** | GitHub Pages | Optimized for fast CDN delivery. |

---
<br id="bilingual-manual">
## Manual

```bash
# 1. Instalar dependencias | Install deps
npm install

# 2. Iniciar servidor de desarrollo | Start dev server
npm run dev

# 3. Construir para producción | Build for production
npm run build

# 4. Previsualizar la construcción localmente | Preview in local
npm run preview

```
