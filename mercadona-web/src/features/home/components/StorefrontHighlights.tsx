import { ChevronRight, MessageCircleQuestion } from 'lucide-react';

const products = [
  {
    name: 'Surtido de caramelos Mix El Conde Drácula y Zombie Lokopop Cerdán',
    size: 'Paquete 150 g',
    price: '1,35 €',
    unit: '/ud.',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80',
    alt: 'Caramelos',
  },
  {
    name: 'Barquillos de cacao rellenos con crema de leche y avellanas Knoppers',
    size: '5 paquetes x 25 g',
    price: '1,25 €',
    unit: '/pack',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
    alt: 'Galletas',
  },
  {
    name: 'Chocolate con leche Fussion Hacendado relleno de caramelo',
    size: 'Paquete 95 g',
    price: '1,35 €',
    unit: '/ud.',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80',
    alt: 'Chocolate',
  },
  {
    name: 'Guanciale Hacendado',
    size: 'Pieza 250 g aprox.',
    price: '3,75 €',
    unit: '/ud.',
    image: 'https://images.unsplash.com/photo-1602491453631-e2a5690ecd74?w=400&q=80',
    alt: 'Guanciale',
  },
  {
    name: 'Barritas crujientes Crunchy Milk Hacendado',
    size: 'Paquete 8 ud. (92 g)',
    price: '1,80 €',
    unit: '/ud.',
    image: 'https://images.unsplash.com/photo-1623328212140-62141506eb32?w=400&q=80',
    alt: 'Barritas',
  },
  {
    name: 'Barritas de barquillo Cheesecake Caramel Hacendado',
    size: 'Paquete 5 ud. (115 g)',
    price: '1,80 €',
    unit: '/ud.',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80',
    alt: 'Cheesecake barritas',
  },
];

export function StorefrontHighlights() {
  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-mercadona-green px-4 py-2.5 font-bold text-white shadow-lg hover:bg-green-700"
      >
        <MessageCircleQuestion size={24} aria-hidden="true" />
        <span>Ayuda</span>
      </button>

      <section className="mt-12 mb-12" aria-labelledby="featured-products-heading">
        <div className="mb-4">
          <h2 id="featured-products-heading" className="text-2xl font-bold text-gray-900">
            Productos del momento
          </h2>
          <p className="mt-1 text-sm text-gray-500">Selección de productos destacados</p>
        </div>

        <div className="group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-gray-900">
          <img
            src="https://prod-mercadona.imgix.net/images/cca7d1157fce04561b54f6e02d70ebd6.jpg?h=500"
            alt="Halloween Banner"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/60 to-transparent p-8 sm:p-12">
            <h3 className="mb-6 max-w-md text-3xl leading-tight font-bold text-white sm:text-4xl">
              ¡Boo! Llega Halloween
            </h3>
            <button
              type="button"
              className="rounded-full bg-[#7DA9DB] px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#6c98ca]"
            >
              Ver productos
            </button>
          </div>
        </div>
      </section>

      <hr className="mb-10 border-gray-200" />

      <section className="mb-12" aria-labelledby="new-products-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="new-products-heading" className="text-2xl font-bold text-gray-900">
              Novedades
            </h2>
            <p className="mt-1 text-sm text-gray-500">Productos recién añadidos o mejorados</p>
          </div>
          <a
            href="#novedades"
            className="flex shrink-0 items-center font-bold text-mercadona-green hover:underline"
          >
            Ver todas las novedades
            <ChevronRight size={20} aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <article
              key={product.name}
              className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-transparent p-3 transition-colors hover:border-gray-200"
            >
              <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mb-1 line-clamp-3 text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="mb-2 text-xs text-gray-500">{product.size}</p>
                <div className="mt-auto">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500"> {product.unit}</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-full border-2 border-mercadona-green bg-white py-1.5 font-bold text-mercadona-green transition-colors hover:bg-mercadona-green hover:text-white"
              >
                Añadir al carro
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
