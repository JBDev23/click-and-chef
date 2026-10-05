### 📖 Guía de Onboarding Estricta: Kedeia Mobile

Bienvenidos al proyecto. Esta aplicación utiliza un stack profesional moderno (React Native, Expo, NativeWind v4 y WatermelonDB). Dado que usamos bases de datos locales con código nativo (C++), Expo Go no es compatible. Debemos compilar la aplicación localmente.

Sigue estos pasos exactamente en este orden para no romper el entorno.

### 🛠️ Fase 1: Requisitos Previos (Instalación de Software)

Antes de tocar el código, asegúrate de tener instalado lo siguiente:

Node.js (LTS): Descarga e instala la versión recomendada (LTS) desde nodejs.org. Esto incluye npm.

Git: Descarga e instala Git desde git-scm.com.

Android Studio: Obligatorio para compilar la app.

Descárgalo desde developer.android.com/studio.

Al instalarlo, asegúrate de marcar las casillas para instalar Android SDK, Android SDK Platform y Android Virtual Device (AVD).

### 📥 Fase 2: Clonar e Instalar

Abre tu terminal (PowerShell en Windows o Terminal en Mac) y ejecuta los siguientes comandos línea por línea:

```bash

# 1. Clona el repositorio (te pedirá tus credenciales de GitHub)

git clone https://github.com/JBDev23/kedeia-mobile.git

# 2. Entra en la carpeta del proyecto

cd kedeia-mobile

# 3. Instala las dependencias EXACTAS del proyecto (NO uses 'npm install')

npm ci

```

(Nota: Usamos npm ci --legacy-peer-deps para garantizar que todos usamos las mismas versiones exactas de las librerías y evitar conflictos con Expo y Babel).

### ⚠️ IMPORTANTE (Solo para usuarios de Windows): Habilitar Rutas Largas (Long Paths)

React Native y Node generan árboles de carpetas muy profundos que superan el límite histórico de Windows. Si no activas las rutas largas, la compilación fallará o no podrás clonar el repositorio completo.

Abre PowerShell como Administrador (búscalo en el menú inicio, clic derecho > Ejecutar como administrador).

Pega y ejecuta este comando para decirle a Windows que acepte rutas largas:

```PowerShell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

Luego, dile a Git que también las acepte ejecutando:

```Bash
git config --system core.longpaths true
```

### 📱 Fase 3: Arrancar la Aplicación

Tienes dos opciones para ver la aplicación: usar un emulador en tu pantalla o conectarla por cable a tu móvil físico.

Opción A: Usar el Emulador (Recomendado para PC potentes)
Abre Android Studio.

Ve a Tools > Device Manager (Administrador de dispositivos).

Haz clic en Create Device, elige un modelo (ej. Pixel 7) y descarga la imagen del sistema recomendada.

Dale al botón de Play (▶) para encender el emulador.

Una vez el emulador esté encendido en tu pantalla, vuelve a la terminal de tu proyecto y ejecuta:

- **Si usas Android / Windows:** `npm run android`
- **Si usas Mac / iPhone:** `npm run ios`

(Este comando descargará las herramientas nativas, compilará el código C++ de la base de datos e instalará la app en el emulador).

Opción B: Usar tu Móvil Físico (Android)
En tu móvil, ve a Ajustes > Acerca del teléfono y pulsa 7 veces sobre "Número de compilación" para activar las Opciones para desarrolladores.

Ve a Ajustes > Opciones para desarrolladores y activa la Depuración por USB.

Conecta tu móvil al ordenador con un cable USB (si te sale un aviso en el móvil pidiendo permisos, acéptalo).

En la terminal de tu proyecto, ejecuta:

- **Si usas Android / Windows:** `npm run android`
- **Si usas Mac / iPhone:** `npm run ios`

(La app se compilará en tu ordenador y se instalará automáticamente como una app real en tu teléfono).

### 🌿 Fase 4: Flujo de Trabajo (Prohibido tocar Main)

La rama main está bloqueada por seguridad. Todo el código debe pasar por validación automática (CI/CD) antes de unirse.

Empieza a trabajar: Crea siempre una rama nueva para tu tarea.

```bash
git checkout -b feature/nombre-de-tu-tarea
```

Guarda tu trabajo: Añade tus archivos y haz commit.

```bash
git add .
git commit -m "feat: descripción de lo que has hecho"
```

(Nota: Al hacer commit, la terminal se pausará un momento para formatear el código y revisar errores. Si hay errores graves, el commit será rechazado. Arrégalos y vuelve a intentarlo).

Sube tu código:

```bash
git push origin feature/nombre-de-tu-tarea
```

Fusión: Ve a GitHub, abre un Pull Request y espera a que las GitHub Actions (los checks automáticos) se pongan en verde. Si fallan, corrige los errores en tu rama local, vuelve a hacer commit y push.

### 🧹 Comandos Útiles para el Día a Día

Para arrancar el servidor de desarrollo normalmente (más rápido):

```bash
npm run start
```

Si la aplicación hace cosas raras con los estilos (Tailwind), has instalado librerías nuevas o el emulador se queda pillado, reinicia limpiando la caché:

```bash
npm run start:clear
```

Antes de subir código, puedes asegurarte de que todo está perfecto ejecutando:

```bash
npm run format     # Para alinear y embellecer el código
npm run typecheck  # Para buscar errores de TypeScript
```
