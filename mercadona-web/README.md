# 💙 Kedeia - Web

Esta es la plataforma de coordinación de cuidados a domicilio (App Web para familiares y App Móvil Offline-First para cuidadores). Su objetivo es eliminar el caos de los mensajes y el papel, aportando seguridad clínica y transparencia.

**Stack Tecnológico:**

- **Framework:** Next.js (App Router) + React
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Estado/Datos:** TanStack React Query + Axios
- **Formularios:** React Hook Form + Zod
- **Calidad de Código:** ESLint, Prettier, Husky, GitHub Actions

---

## 🚀 Requisitos Previos

Antes de empezar, asegúrate de tener instaladas estas herramientas en tu equipo:

1. **Node.js (v24 o superior):** Es la versión que usamos en nuestro entorno de integración (CI). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
2. **Git:** Para el control de versiones.
3. **pnpm (v12):** Usamos `pnpm` en lugar de `npm` porque es mucho más rápido y eficiente.
   - Instálalo ejecutando en tu terminal: `npm install -g pnpm`

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para arrancar el proyecto en tu máquina local:

1. **Clona el repositorio:**

```bash
   git clone https://github.com/JBDev23/kedeia-web.git
   cd kedeia-web
```

Instala las dependencias:
Al ejecutar este comando, también se instalará automáticamente Husky (nuestra herramienta para validar el código antes de hacer commit).

```bash
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

Abre http://localhost:3000 en tu navegador para ver la aplicación corriendo.

## 📜 Comandos Útiles

En tu día a día utilizarás principalmente `pnpm run dev`, pero tienes otras herramientas a tu disposición:

`pnpm run format`: Formatea todo el código usando Prettier (ideal antes de hacer commit si tu editor no lo hace automático).

`pnpm run lint:fix`: Busca y corrige problemas de código o variables sin usar.

`pnpm run type-check`: Verifica que no haya errores de tipado en TypeScript.

`pnpm run build`: Compila la aplicación para producción (útil para comprobar que todo funciona antes de subirlo).

# 🏗️ Arquitectura del Proyecto

El código fuente está dentro de src/ y está organizado por "Características" (Features) para no mezclar la lógica de la app web con la app móvil:

`app/:` Contiene el enrutador de Next.js (pantallas web y móvil).

`components/`: Componentes visuales genéricos (botones, inputs, modales).

`features/`: El núcleo lógico. Aquí van los componentes complejos, hooks y esquemas separados por dominio (bitacora, tareas, ai-voice).

`lib/`: Configuraciones globales (Axios, React Query).

# 🌳 Flujo de Trabajo (Git & Pull Requests)

Para mantener el código estable y limpio, seguimos estas buenas prácticas:

1. Nunca trabajes en la rama main
   Antes de escribir código, crea siempre una rama nueva desde main. Usa estos prefijos según lo que vayas a hacer:

`feature/nombre-de-la-funcionalidad` (Ej: feature/formulario-bitacora)

`bugfix/nombre-del-error` (Ej: bugfix/crash-al-guardar)

```bash
git checkout main
git pull
git checkout -b feature/mi-nueva-tarea
```

2. Haciendo Commits (El Guardián Husky 🐶)
   Cuando intentes hacer un commit (`git commit -m "..."`), Husky revisará tu código automáticamente.

Pasará Prettier para formatearlo.

Pasará ESLint para buscar errores.

Si hay un error grave, el commit será rechazado. Deberás arreglar el código en tu editor e intentarlo de nuevo.

3. Subir el código y crear una Pull Request (PR)
   Cuando termines tu tarea:

Sube tu rama: `git push -u origin feature/mi-nueva-tarea`

Ve a GitHub y abre una Pull Request (PR) hacia la rama main.

El CI/CD de GitHub ejecutará pruebas automáticas. Si falla (cruz roja), debes arreglar el código en tu rama y volver a subirlo.

Pide a un compañero que revise tu código (Code Review).

Una vez aprobado y con el CI/CD en verde (check ✔️), se puede fusionar (Merge) con main.
