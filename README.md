# 🌳 git://learn — Guía Interactiva de Git & GitHub

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

**Una guía web completa e interactiva para aprender Git y GitHub desde cero.**  
Sin instalaciones. Sin configuración. Solo abre el navegador y empieza.

[Ver Demo](#) · [Reportar un bug](#) · [Proponer una mejora](#)

</div>

---

## 📖 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Cómo usar](#-cómo-usar)
- [Secciones del contenido](#-secciones-del-contenido)
- [Terminal interactiva](#-terminal-interactiva)
- [Tecnologías](#-tecnologías)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📌 Descripción

**git://learn** es una aplicación web estática diseñada para enseñar Git y GitHub de forma visual, práctica y progresiva. Cubre desde los conceptos más básicos hasta flujos de trabajo avanzados en equipos reales, todo en una sola página con navegación fluida y una terminal simulada para practicar comandos sin riesgo.

Ideal para:
- 🎓 Estudiantes que aprenden control de versiones por primera vez
- 👩‍💻 Desarrolladores que quieren reforzar su flujo de trabajo con Git
- 🏫 Docentes que buscan un recurso didáctico listo para usar en clase

---

## ✨ Características

- **Guía completa en 6 secciones** — desde conceptos básicos hasta SSH, conflictos y CI/CD
- **Terminal interactiva simulada** — practica comandos Git reales sin instalar nada
- **Navegación por pestañas** — accede rápidamente a Pull Requests, Forks, Conflictos, SSH y CI/CD
- **Diagramas de flujo visuales** — entiende el ciclo Working Directory → Staging → Local Repo → Remote
- **Diseño responsive** — funciona en escritorio, tablet y móvil
- **Menú hamburguesa** — navegación móvil optimizada
- **Historial de comandos** — navega con ↑↓ por los comandos ejecutados en la terminal
- **Botones de acceso rápido** — inserta comandos frecuentes con un solo clic
- **Sin dependencias externas** — solo HTML, CSS y JavaScript vanilla

---

## 📸 Capturas de pantalla

| Hero & Navegación | Sección de Comandos | Terminal Interactiva |
|:-----------------:|:-------------------:|:--------------------:|
| *(Hero con grid animado y badge de versiones)* | *(Tabla completa de comandos Git)* | *(Simulador con prompt de bash)* |

---

## 📁 Estructura del proyecto

```
git-learn/
├── index.html       # Estructura principal y contenido HTML
├── styles.css       # Estilos, variables CSS y diseño responsive
└── script.js        # Lógica de la terminal simulada, tabs y menú
```

### Descripción de archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `index.html` | Contiene las 6 secciones de contenido, el hero, la navbar y la terminal |
| `styles.css` | Sistema de diseño con variables CSS, animaciones y diseño mobile-first |
| `script.js` | Simulador de terminal con estado de repositorio, gestión de tabs y menú hamburguesa |

---

## 🚀 Cómo usar

Como es una aplicación completamente estática, no necesitas ningún servidor ni instalación:

### Opción 1 — Abrir directamente

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/git-learn.git

# Entra al directorio
cd git-learn

# Abre index.html en tu navegador
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Opción 2 — Live Server (recomendado para desarrollo)

```bash
# Con la extensión Live Server de VS Code
# Clic derecho en index.html → "Open with Live Server"

# O con npx
npx serve .
```

### Opción 3 — Publicar en GitHub Pages

```bash
# Sube tu repositorio a GitHub y activa Pages en:
# Settings → Pages → Source: Deploy from branch (main / root)
```

---

## 📚 Secciones del contenido

### 01 · Intro — ¿Qué es Git y GitHub?
Conceptos fundamentales explicados con tarjetas visuales: Git vs GitHub, repositorios, commits, ramas y Pull Requests.

### 02 · Flujo de trabajo Git
Diagrama interactivo del ciclo de vida de los archivos:
```
Working Directory → [git add] → Staging Area → [git commit] → Local Repo → [git push] → Remote
```

### 03 · Comandos esenciales
Referencia rápida de los comandos más usados, organizada por categoría con ejemplos de salida real en terminal.

### 04 · Ramas (Branches)
Cómo crear, navegar, fusionar y eliminar ramas. Incluye estrategias de branching y el comando `git switch`.

### 05 · Colaboración
Flujos de trabajo en equipo con pestañas navegables:
- **Pull Requests** — flujo completo de contribución en un repositorio compartido
- **Fork** — contribuir a proyectos donde no tienes acceso directo
- **Conflictos** — cómo detectar y resolver conflictos de merge
- **SSH** — configurar autenticación por clave SSH con GitHub
- **CI/CD** — automatizar tests y despliegues con GitHub Actions

### 06 · Terminal interactiva
Simulador de Git en el navegador para practicar sin riesgo.

---

## 💻 Terminal interactiva

La terminal simulada mantiene un **estado interno del repositorio** y responde a más de 20 comandos Git:

| Categoría | Comandos soportados |
|-----------|---------------------|
| Setup | `git init`, `git clone`, `git config` |
| Básicos | `git status`, `git add`, `git commit`, `git diff`, `git stash` |
| Ramas | `git branch`, `git switch`, `git checkout`, `git merge` |
| Remoto | `git remote`, `git push`, `git pull`, `git fetch` |
| Historial | `git log`, `git log --oneline`, `git log --graph`, `git show`, `git reset`, `git revert` |
| Utilidades | `help`, `clear` |

**Funcionalidades extra de la terminal:**
- Navegación por historial con teclas `↑` y `↓`
- Botones de acceso rápido para los comandos más frecuentes
- Mensajes de error descriptivos con sugerencias
- Estado persistente durante la sesión (ramas, commits, staging area)

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica y contenido |
| **CSS3** | Variables custom, Flexbox, Grid, animaciones |
| **JavaScript ES6+** | Lógica de la terminal, tabs y navegación |
| **JetBrains Mono** | Tipografía monoespaciada para bloques de código |
| **Syne** | Tipografía para títulos y headings |

No se utilizan frameworks, librerías externas ni sistemas de build. El proyecto es 100% vanilla y listo para producción tal como está.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar el contenido, agregar comandos a la terminal o mejorar el diseño:

1. Haz un fork del repositorio
2. Crea una rama para tu feature:
   ```bash
   git switch -c feature/mi-mejora
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "feat: descripción de la mejora"
   ```
4. Sube los cambios:
   ```bash
   git push origin feature/mi-mejora
   ```
5. Abre un Pull Request describiendo tus cambios

### Guía de estilo de commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    cambios de formato o estilos CSS
refactor: refactorización de código
```

---



---

<div align="center">



</div>
