# Click-and-Chef: backend

Java 21, Spring Boot 4.1.1, Spring MVC, JPA, PostgreSQL 17, Flyway y Swagger.
Permite consultar recetas, personalizar cantidades, calcular precios y mantener un carrito invitado.
No incluye frontend, usuarios registrados, pedidos, pagos, stock ni sustituciones de ingredientes.

## Arranque de la demo

Requisitos: Java 21 y Docker Desktop en ejecución. No hace falta instalar Maven.
Desde `mercadona-backend`, en PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d --wait
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=demo"
```

En macOS/Linux:

```sh
cp .env.example .env
docker compose up -d --wait
sh ./mvnw spring-boot:run -Dspring-boot.run.profiles=demo
```

API: `http://localhost:8082/api/v1`.
Swagger: [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html).
OpenAPI: [http://localhost:8082/v3/api-docs](http://localhost:8082/v3/api-docs).
Salud: `http://localhost:8082/actuator/health`. Se conserva `GET /api/test`.

El perfil `demo` importa los 4.723 productos de `src/main/resources/catalog/products_macro.csv`
y crea tres recetas provisionales. Repetir el arranque no duplica productos, recetas ni ingredientes;
tampoco modifica las selecciones del carrito o las reglas comerciales existentes.
Sin el perfil `demo`, Flyway crea/valida el esquema pero no importa datos.

| Plato | Precio por ración | Cantidades incluidas |
| --- | --- | --- |
| Pasta con tomate y queso | 5,90 € | Macarrón 100 g, tomate 100 g, queso 50 g |
| Pasta con pollo | 6,90 € | Macarrón 100 g, tomate 100 g, queso 50 g, pollo 100 g |
| Paella de marisco | 7,90 € | Arroz 100 g, preparado de marisco 150 g, tomate 50 g, judía verde 50 g |

Las bebidas son agua Bronchales de 500 ml (0,29 €), Coca-Cola de 330 ml (0,92 €)
y Coca-Cola Zero de 330 ml (0,92 €). El postre inicial es un flan individual (0,38 €).
El precio del flan servido es independiente de los 1,50 € del paquete de cuatro en el catálogo.

## Reglas de personalización y precio

- Cada ingrediente permite cantidades de cero a dos veces la incluida, en pasos de 25 g.
- Quitar o reducir ingredientes no reduce el precio base.
- Aumentarlos cobra únicamente los pasos que superan la cantidad incluida. Reducir otro ingrediente no compensa ese suplemento.
- El suplemento inicial por 25 g se calcula a partir del precio del envase: macarrón 0,04 €, tomate 0,04 €, queso 0,22 €, pollo 0,40 €, arroz 0,03 €, marisco 0,15 € y judía verde 0,04 €.
- Bebida y postre son opcionales; como máximo uno de cada tipo por ración.
- Una línea admite entre 1 y 99 raciones con la misma configuración. La bebida y el postre se multiplican también por las raciones.
- Los ingredientes omitidos mantienen su cantidad incluida. Para retirar uno, enviar cantidad cero.
- Consultar el precio no guarda nada ni reserva un importe. Añadir o editar una línea recalcula el precio.
- Las líneas guardan una copia de nombres, cantidades y precios aplicados. Leer el carrito no consulta precios actuales.
- Añadir el mismo plato otra vez crea una nueva línea, aunque la configuración coincida.

La fórmula por ingrediente es `max(0, elegida - incluida) / paso × suplemento`.
El precio por ración suma base, suplementos, bebida y postre. El total multiplica por las raciones.
Los cálculos usan `BigDecimal` y `HALF_UP`; los importes HTTP son cadenas decimales de dos posiciones, con moneda `EUR`.
Los campos de precio que pueda enviar un cliente no intervienen en el cálculo.

## Contrato HTTP

`id` es el identificador de base de datos empleado en peticiones. `sourceId` corresponde al ID original del CSV;
no deben intercambiarse. Obtener los IDs de los endpoints de catálogo.

| Método y ruta | Petición / respuesta |
| --- | --- |
| `GET /api/v1/dishes` | Lista de platos activos con `id`, `slug`, nombre y precio base. |
| `GET /api/v1/dishes/{id}` | Receta con `dishIngredientId`, `productId`, `sourceId`, disponibilidad, cantidades, paso, unidad y suplemento. |
| `GET /api/v1/products?role=DRINK` | Bebidas elegibles, formato servido y precio por unidad. |
| `GET /api/v1/products?role=DESSERT` | Postres elegibles. |
| `POST /api/v1/dishes/{id}/quote` | Configuración → desglose de precio sin persistir. |
| `POST /api/v1/carts` | Sin cuerpo. HTTP 201 con `cartId`, `cartToken`, moneda y fecha. |
| `GET /api/v1/carts/{id}` | Carrito con líneas y total. |
| `POST /api/v1/carts/{id}/items` | `{dishId, configuration}` → HTTP 201 y carrito actualizado. |
| `PUT /api/v1/carts/{id}/items/{itemId}` | Configuración completa → carrito actualizado. El plato de la línea permanece. |
| `DELETE /api/v1/carts/{id}/items/{itemId}` | Carrito actualizado, HTTP 200. |

Configuración para consultar precio o reemplazar una línea (IDs ilustrativos):

```json
{
  "ingredients": [
    { "dishIngredientId": 3, "quantity": 75 }
  ],
  "drinkProductId": 2820,
  "dessertProductId": 1587,
  "quantity": 2
}
```

Las cantidades de ingredientes describen **una ración**. El `quantity` exterior es el número de raciones.
`drinkProductId` y `dessertProductId` pueden omitirse o ser `null`. `ingredients` puede omitirse o ser una lista vacía.

El desglose incluye `basePrice`, `ingredientExtras`, `drinkPrice`, `dessertPrice`, `unitPrice`, `quantity`, `total`,
ingredientes elegidos y complementos. Cada línea de carrito lo devuelve en `price`.

### Ejemplo ejecutable en PowerShell

```powershell
$api = 'http://localhost:8082/api/v1'
$dishes = Invoke-RestMethod "$api/dishes"
$dish = $dishes | Where-Object slug -eq 'pasta-tomate-queso'
$detail = Invoke-RestMethod "$api/dishes/$($dish.id)"
$cheese = $detail.ingredients | Where-Object sourceId -eq 692
$drinks = Invoke-RestMethod "$api/products?role=DRINK"
$water = $drinks | Where-Object sourceId -eq 2820
$desserts = Invoke-RestMethod "$api/products?role=DESSERT"
$flan = $desserts | Where-Object sourceId -eq 1587

$configuration = @{
  ingredients = @(@{ dishIngredientId = $cheese.dishIngredientId; quantity = 75 })
  drinkProductId = $water.id
  dessertProductId = $flan.id
  quantity = 2
}
$quote = Invoke-RestMethod "$api/dishes/$($dish.id)/quote" -Method Post `
  -ContentType 'application/json' -Body ($configuration | ConvertTo-Json -Depth 6)
# Precio por ración: 6,79 €. Total: 13,58 €.

$cart = Invoke-RestMethod "$api/carts" -Method Post
$headers = @{ 'X-Cart-Token' = $cart.cartToken }
$body = @{ dishId = $dish.id; configuration = $configuration } | ConvertTo-Json -Depth 6
$updated = Invoke-RestMethod "$api/carts/$($cart.cartId)/items" -Method Post `
  -Headers $headers -ContentType 'application/json' -Body $body
Invoke-RestMethod "$api/carts/$($cart.cartId)" -Headers $headers

$itemId = $updated.items[0].id
# PUT reemplaza toda la selección: al omitir complementos, se retiran.
Invoke-RestMethod "$api/carts/$($cart.cartId)/items/$itemId" -Method Put `
  -Headers $headers -ContentType 'application/json' -Body '{"quantity":1}'
Invoke-RestMethod "$api/carts/$($cart.cartId)/items/$itemId" -Method Delete -Headers $headers
```

## Acceso al carrito y errores

Conservar `cartId` y `cartToken` en el cliente. El token se devuelve solo al crear el carrito:
tiene 256 bits aleatorios y el servidor guarda únicamente su hash SHA-256.
Todas las consultas y modificaciones de carritos requieren `X-Cart-Token`.
En Swagger, usar **Authorize → CartToken** con ese valor.

Los errores usan `application/problem+json`:

- 400: configuración inválida, duplicados, ingredientes ajenos, cantidad/paso incorrecto o producto no elegible.
- 404: plato, producto, carrito o línea inexistente; una línea ajena a un carrito tampoco es accesible.
- 403: token ausente o incorrecto.

Los errores de negocio incluyen `code`; los errores de validación de campos incluyen `errors`.
No existen reservas de stock ni garantía de precio previa a añadir una línea.

## Configuración y persistencia

| Variable | Valor local por defecto |
| --- | --- |
| `SERVER_PORT` | `8082` |
| `DB_URL` | `jdbc:postgresql://localhost:5441/mercadona_db` |
| `DB_USERNAME` / `DB_PASSWORD` | `postgres` / `root`, solo desarrollo local |
| `POSTGRES_DB` / `POSTGRES_PORT` | `mercadona_db` / `5441`, para Compose |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:8081,http://127.0.0.1:8081` |
| `CATALOG_IMPORT_RESOURCE` | `classpath:catalog/products_macro.csv`, con perfil `demo` |

Spring Boot no lee por sí solo el `.env` de Compose. Si cambias la conexión, exporta `DB_*` en la terminal
o configúralas en el IDE. CORS permite el encabezado del carrito y rechaza orígenes no configurados.

Flyway aplica migraciones de `src/main/resources/db/migration`; Hibernate únicamente valida el esquema.
No cambiar migraciones ya aplicadas. No hay borrados automáticos ni baseline automático para esquemas existentes:
si tienes tablas previas sin historial Flyway, revisa su compatibilidad antes de migrar.
`docker compose down` conserva el volumen y los carritos.

El campo `nutritional_info` se conserva como texto original: el CSV no garantiza macros estructurados.
`discount_price` también se conserva; no se trata como una promoción activa sin información de vigencia.
Los suplementos y precios servidos son reglas comerciales separadas del precio de envase.
No se infiere el formato de todos los productos: la demo normaliza los pocos envases necesarios.

## Organización del código

El backend es una aplicación Spring Boot organizada por funcionalidad y, dentro de cada
funcionalidad, por responsabilidad técnica. Los paquetes parten de `com.mercadona.hackathon`:

```text
catalog/
  controller/   ProductController
  service/      ProductCatalogService, ProductImportService, DemoDataService
  entity/       Product, ProductRole
  repository/   ProductRepository
  dto/          ComplementResponse
  bootstrap/    DemoDataInitializer
dish/
  controller/   DishController
  service/      DishService, MealService, MealPricingService
  entity/       Dish, DishIngredient, MeasurementUnit
  repository/   DishRepository
  dto/          Peticiones de configuración y respuestas de receta/precio
  validation/   MealConfigurationValidator
  model/        ValidatedMeal, PricedMeal (resultados internos del negocio)
cart/
  controller/   CartController
  service/      CartService, CartTokenService
  entity/       Cart, CartItem, CartItemIngredient, CartItemAddon
  repository/   CartRepository
  dto/          AddDishToCartRequest y respuestas del carrito
common/
  config/       WebConfig
  exception/    ApiException, ApiExceptionHandler
  util/         Money
  controller/   TestController (endpoint de comprobación existente)
```

Los controladores reciben HTTP y delegan en los servicios. Los servicios coordinan las
reglas de negocio y las transacciones; los repositorios acceden a PostgreSQL mediante JPA.
Las entidades representan las tablas y relaciones, y los DTOs definen los datos que recibe
y devuelve la API. Las respuestas de catálogo, platos y carrito tienen archivos propios
en `dto`, separados de los servicios.

`MealConfigurationValidator` y `MealPricingService` se comparten entre la consulta de
precio y el carrito. `model` contiene los resultados internos de validación y cálculo;
no son entidades persistidas ni peticiones HTTP. `bootstrap` prepara los datos del perfil
`demo`, y `common` reúne configuración, errores y utilidades compartidas.

## Pruebas y CI

```powershell
.\mvnw.cmd --batch-mode spotless:check
.\mvnw.cmd --batch-mode verify
```

Las pruebas arrancan su propio PostgreSQL 17 mediante Testcontainers: necesitan Docker y no utilizan tu base local.
Cubren migraciones, CSV, idempotencia, precios, validaciones, snapshots, aislamiento, concurrencia, CORS y OpenAPI.
Para aplicar el formato al desarrollar: `.\mvnw.cmd spotless:apply`.
El workflow de backend se encuentra en `.github/workflows/backend.yml` en la raíz del monorepo.
