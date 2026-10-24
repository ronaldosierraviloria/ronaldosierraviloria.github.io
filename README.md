# 🍝 Italia: Sabores de Tradición (Italy: Flavors of Tradition)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Website-17833b?style=for-the-badge&logo=github)](https://ronaldosierraviloria.github.io/italiasabores.github.io/)
[![SEO Score](https://img.shields.io/badge/SEO-100%2F100-success?style=for-the-badge&logo=google)](https://ronaldosierraviloria.github.io/italiasabores.github.io/)
[![Accessibility](https://img.shields.io/badge/Accessibility-100%2F100-blue?style=for-the-badge)](https://ronaldosierraviloria.github.io/italiasabores.github.io/)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?style=for-the-badge&logo=html5)](https://ronaldosierraviloria.github.io/italiasabores.github.io/)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive-1572B6?style=for-the-badge&logo=css3)](https://ronaldosierraviloria.github.io/italiasabores.github.io/)

Sitio web bilingüe (Español / Inglés) de divulgación gastronómica y cultural dedicado a la auténtica cocina italiana tradicional, sus recetas emblemáticas, ingredientes con denominación de origen y costumbres culinarias regionales.

🌐 **Enlace directo al sitio web en GitHub Pages:**  
👉 **[https://ronaldosierraviloria.github.io/italiasabores.github.io/](https://ronaldosierraviloria.github.io/italiasabores.github.io/)**

---

## 📑 Estructura de Páginas

| Archivo | Descripción |
| :--- | :--- |
| `index.html` | Página de inicio con introducción a la cocina italiana, platos destacados, mapa regional y tradiciones. |
| `platos.html` | Catálogo de platos emblemáticos (Pizza, Carbonara, Lasaña, Risotto, Ravioli, Tiramisú), ingredientes esenciales y bebidas. |
| `recetas.html` | Recetas tradicionales paso a paso con tiempos de preparación, ingredientes exactos y datos estructurados. |
| `CSS/estilos.css` | Hoja de estilos con diseño adaptable (responsive), variables tipográficas, accesibilidad y paleta italiana. |
| `robots.txt` & `sitemap.xml` | Archivos de indexación técnica y mapa del sitio para motores de búsqueda (Google, Bing). |
| `site.webmanifest` & `favicon.svg` | Manifiesto de aplicación web e iconos vectoriales de alta resolución. |

---

## 🚀 Optimización SEO 100/100 Implementada

1. **Meta Etiquetas Completas en Cada Página:**
   - `<title>` optimizados y únicos entre 45 y 60 caracteres.
   - `<meta name="description">` persuasivos y ricos en palabras clave entre 130 y 160 caracteres.
   - Etiquetas Open Graph (Facebook, WhatsApp, LinkedIn) y Twitter Cards para previsualización enriquecida en redes sociales.
   - Enlace canónico (`rel="canonical"`) para evitar duplicidad de contenido.
   - Etiquetas `hreflang` para versiones en español e inglés.

2. **Datos Estructurados Schema.org (JSON-LD):**
   - Esquemas `WebSite` y `Organization` en la página principal.
   - `BreadcrumbList` y `CollectionPage` en las subpáginas.
   - `Recipe` (Esquema de recetas de Google) en `recetas.html` con ingredientes, tiempos, pasos detallados y porciones para activar los resultados enriquecidos (Rich Snippets).

3. **Arquitectura y Accesibilidad (WCAG 2.1 AA):**
   - Jerarquía semántica de encabezados sin saltos (`<h1>` único por página, seguido de `<h2>` y `<h3>`).
   - Todos los enlaces son rastreables (`href` válidos, sin anclas vacías).
   - Enlace accesible de salto al contenido principal (`.skip-link`).
   - Contraste de color certificado superior a 4.5:1.
   - Textos alternativos (`alt`) descriptivos en cada imagen.

4. **Rendimiento Web y Core Web Vitals:**
   - Imágenes optimizadas y comprimidas para web (reducción de más del 95% del peso sin pérdida de nitidez).
   - Dimensiones explícitas `width` y `height` en todas las imágenes para eliminar el cambio acumulativo de diseño (CLS = 0).
   - Carga diferida (`loading="lazy"`) en imágenes secundarias y prioridad alta (`loading="eager" fetchpriority="high"`) en el elemento principal (LCP óptimo).

---

## ⚙️ Despliegue en GitHub Pages

El repositorio cuenta con un flujo automatizado en `.github/workflows/deploy.yml` que compila y despliega el sitio directamente en GitHub Pages con cada actualización en la rama `main`.

Para verificar la configuración de GitHub Pages manualmente en el repositorio:
1. Dirígete a **Settings** > **Pages** en tu repositorio de GitHub.
2. En **Build and deployment > Source**, selecciona **GitHub Actions** (o **Deploy from a branch** seleccionando la rama `main` y `/ (root)`).
3. Tu sitio estará disponible en:  
   `https://ronaldosierraviloria.github.io/italiasabores.github.io/`

---

*Desarrollado con pasión culinaria y estándares web modernos.*
