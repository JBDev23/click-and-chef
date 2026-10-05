# Click-and-Chef

Proyecto del **Mercadona Hackathon**: una experiencia de compra de comidas donde el usuario parte de una idea (“quiero pasta”, “algo de marisco”…) y elige cómo llevarla a la mesa.

Hay dos caminos:

1. **Listo para recoger** — elige un plato, personaliza ingredientes, bebida y postre, y lo añade al carrito.
2. **MercaKit** — recibe los productos en las cantidades justas para cocinarlo en casa.

```text
click-and-chef/
├── mercadona-backend/   # API REST (Spring Boot + PostgreSQL)
└── mercadona-web/       # Frontend (Next.js)
```

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, Axios |
| Backend | Java 21, Spring Boot 4.1, Spring MVC, JPA, Flyway, PostgreSQL 17 |
| Docs API | Swagger / OpenAPI (`springdoc`) |
| Calidad | ESLint, Prettier, Husky (web) · Spotless, Testcontainers (backend) |

---

## Requisitos

- **Node.js** 24+ y **pnpm** 12 (`npm install -g pnpm`)
- **Java** 21
- **Docker Desktop** (PostgreSQL local y tests del backend)
- Git

No hace falta instalar Maven: el backend incluye el wrapper (`mvnw` / `mvnw.cmd`).

---

## Arranque rápido

### 1. Backend + base de datos

```powershell
cd mercadona-backend
Copy-Item .env.example .env
docker compose up -d --wait
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=demo"
```

En macOS / Linux:

```sh
cd mercadona-backend
cp .env.example .env
docker compose up -d --wait
sh ./mvnw spring-boot:run -Dspring-boot.run.profiles=demo
```

| Recurso | URL |
| --- | --- |
| API | http://localhost:8082/api/v1 |
| Swagger | http://localhost:8082/swagger-ui/index.html |
| Salud | http://localhost:8082/actuator/health |

El perfil `demo` importa el catálogo (~4.700 productos) y crea tres platos de ejemplo. Más detalle en [`mercadona-backend/README.md`](mercadona-backend/README.md).

### 2. Frontend web

```powershell
cd mercadona-web
Copy-Item .env.example .env.local
pnpm install
pnpm run dev
```

Abre http://localhost:3000.

Variables esperadas (ya en `.env.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082
NEXT_PUBLIC_API_URL=http://localhost:8082/api/v1
```

---

## Qué hace cada parte

### `mercadona-web`

App Next.js (App Router) orientada a la experiencia de tienda:

| Ruta | Función |
| --- | --- |
| `/` | Idea de comida → elegir plato listo o MercaKit |
| `/platos` | Catálogo de platos |
| `/platos/[id]` | Detalle del plato |
| `/platos/[id]/personalizar` | Cantidades, bebida, postre y precio |
| `/kit` | Flujo MercaKit |
| `/carrito` | Carrito de la sesión |

Código organizado por features (`cart`, `dishes`, `home`, `kit`, `meal-customization`) bajo `src/features/`.

Comandos útiles:

```bash
pnpm run dev          # desarrollo
pnpm run build        # build de producción
pnpm run lint:fix     # ESLint
pnpm run type-check   # TypeScript
pnpm run format       # Prettier
```

### `mercadona-backend`

API de catálogo, recetas, cotización de precios y carrito invitado (token `X-Cart-Token`).

Endpoints principales:

- `GET /api/v1/dishes` — platos activos
- `GET /api/v1/dishes/{id}` — receta e ingredientes
- `POST /api/v1/dishes/{id}/quote` — precio sin persistir
- `GET /api/v1/products?role=DRINK|DESSERT` — complementos
- `POST /api/v1/carts` — crear carrito
- `POST|PUT|DELETE /api/v1/carts/{id}/items…` — líneas del carrito

Reglas de personalización, precios y contrato HTTP: [`mercadona-backend/README.md`](mercadona-backend/README.md).

## Flujo de usuario (resumen)

```text
Idea de comida
      │
      ├─► Plato listo  → catálogo → personalizar → carrito
      │
      └─► MercaKit     → productos + cantidades → kit / carrito kit
```

El carrito es de invitado: el backend crea un `cartId` + `cartToken`; el front los guarda en la sesión del navegador.

---

## CI

El monorepo incluye GitHub Actions para el backend (`.github/workflows/backend.yml`): formato Spotless + `mvn verify` con PostgreSQL vía Testcontainers.

---

## Documentación adicional

- Backend (API, reglas de precio, Docker, pruebas): [`mercadona-backend/README.md`](mercadona-backend/README.md)
- Web (setup detallado del front): [`mercadona-web/README.md`](mercadona-web/README.md)

Repositorio: [github.com/JBDev23/click-and-chef](https://github.com/JBDev23/click-and-chef)
