# 🚀 Mercadona-Backend

Este es el backend de la plataforma para el Hackathon de Mercadona IT. Está construido con una arquitectura REST para conectar un panel web y una App Móvil.

## ⚙️ Requisitos Previos

Tus compañeros deben instalar estas herramientas antes de empezar:

* **Java JDK 21**: Versión LTS (recomendado instalar via Temurin/Adoptium).
* **Docker Desktop**: Imprescindible para levantar la base de datos sin ensuciar tu PC.
* **IDE Recomendado**: VS Code (instalar *Extension Pack for Java* y *Spring Boot Extension Pack*) o IntelliJ IDEA.
* **Git**: Para el control de versiones.

## 🛠️ Instalación y Ejecución

No necesitas instalar Maven, el proyecto incluye un "Wrapper" (`mvnw`) que lo descarga automáticamente. Sigue estos pasos:

1. **Clona el repositorio** y entra en la carpeta:
   `git clone https://github.com/JBDev23/mercadona-backend`
2. **Levanta la base de datos** (PostgreSQL en el puerto 5441):
   `docker compose up -d`
3. **Arranca el servidor de Spring Boot**:
   * En Windows: `./mvnw.cmd spring-boot:run`
   * En Mac/Linux: `./mvnw spring-boot:run`
4. **Prueba la API**: Abre tu navegador y ve a la documentación interactiva (Swagger) en:
   [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html)

## 🧹 Formateo de Código (Spotless)

Para mantener el código limpio y evitar que el CI/CD de GitHub rechaze los cambios, utilizamos el estándar de Google a través de Spotless.

* **Para comprobar si hay errores de formato**:
  `mvnw spotless:check`
* **Para arreglar el formato automáticamente** (¡Ejecuta esto antes de cada commit!):
  `mvnw spotless:apply`