'use client';

import { ChevronLeft, ChevronRight, MessageCircleQuestion } from 'lucide-react';
import { useRef } from 'react';

/** Productos reales del catálogo Mercadona (products_macro.csv), temática de temporada. */
const seasonalProducts = [
  {
    id: 665,
    name: 'Media calabaza cacahuete',
    size: '1/2 Pieza 740 g aprox.',
    price: '1,70 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/dd206aa330fd0e0772f418126500fdd2.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 657,
    name: 'Calabaza cacahuete cortada a trozos',
    size: 'Bandeja 520 g aprox.',
    price: '2,11 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/d9843df8bd68947d69e6960579f62e7f.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 1385,
    name: 'Surtido de caramelos Diver Xuxes Hacendado',
    size: 'Paquete 300 g',
    price: '2,35 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/3b4037e390905b1073fd5900f7da8008.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 1381,
    name: 'Caramelo Pikotas masticable Dulciora',
    size: 'Paquete 100 g',
    price: '1,45 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/775dd52e7b1b67f6cae950bb3781ee0d.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 1717,
    name: 'Chocolate con leche Fussion Hacendado relleno de galleta caramelizada',
    size: 'Tableta 110 g',
    price: '1,35 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/6e4ccc56e05bd6ea02a31c55f109b993.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 1714,
    name: 'Chocolate con leche Fussion Hacendado relleno crema de fresa',
    size: 'Tableta 110 g',
    price: '1,35 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/19aa713999445aa47eca1dd187919936.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 2086,
    name: 'Crema de calabaza y zanahoria Hacendado',
    size: 'Bol 350 g',
    price: '1,70 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/c4f8572501d428cdb9583b35db56e690.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 2090,
    name: 'Crema de calabaza Hacendado',
    size: 'Brick 500 ml',
    price: '1,00 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/80d021ae800656f6845220497f43d86b.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 2162,
    name: 'Pasta fresca medialunas calabaza con cebolla Hacendado',
    size: 'Bandeja 250 g',
    price: '2,15 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/eec1449156943e7b3b9c1eab105b6443.jpg?fit=crop&h=600&w=600',
  },
  {
    id: 1288,
    name: 'Barritas de cereales Hacendado chocolate con leche',
    size: 'Caja 6 barritas (120 g)',
    price: '1,55 €',
    unit: '/ud.',
    image:
      'https://prod-mercadona.imgix.net/images/d873cc7c5f9b10efd6967eccf90e1511.jpg?fit=crop&h=600&w=600',
  },
] as const;

function ProductCarousel({
  products,
  labelledBy,
}: {
  products: typeof seasonalProducts;
  labelledBy: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>('[data-product-card]');
    const amount = (card?.offsetWidth ?? 220) + 16;
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Ver productos anteriores"
        onClick={() => scrollByCard(-1)}
        className="absolute top-1/2 left-0 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 lg:flex"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Ver más productos"
        onClick={() => scrollByCard(1)}
        className="absolute top-1/2 right-0 z-10 hidden size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 lg:flex"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      <div
        ref={scrollerRef}
        role="list"
        aria-labelledby={labelledBy}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {products.map((product) => (
          <article
            key={product.id}
            data-product-card
            role="listitem"
            className="group relative flex w-[160px] shrink-0 snap-start flex-col rounded-xl border border-transparent p-3 transition-colors hover:border-gray-200 sm:w-[180px] lg:w-[200px]"
          >
            <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <h3 className="mb-1 line-clamp-3 text-sm font-medium text-gray-800">{product.name}</h3>
              <p className="mb-2 text-xs text-gray-500">{product.size}</p>
              <div className="mt-auto">
                <span className="text-lg font-bold text-gray-900">{product.price}</span>
                <span className="text-sm text-gray-500"> {product.unit}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-full border-2 border-mercadona-green bg-white py-1.5 text-sm font-bold text-mercadona-green transition-colors hover:bg-mercadona-green hover:text-white"
            >
              Añadir al carro
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

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
          <p className="mt-1 text-sm text-gray-500">Selección de productos de temporada</p>
        </div>

        <div className="group relative h-[300px] overflow-hidden rounded-2xl bg-gray-900">
          <img
            src="https://prod-mercadona.imgix.net/images/cca7d1157fce04561b54f6e02d70ebd6.jpg?h=500"
            alt="Halloween Banner"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/60 to-transparent p-8 sm:p-12">
            <h3 className="mb-6 max-w-md text-3xl leading-tight font-bold text-white sm:text-4xl">
              ¡Boo! Llega Halloween
            </h3>
            <a
              href="#productos-temporada"
              className="rounded-full bg-[#7DA9DB] px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#6c98ca]"
            >
              Ver productos
            </a>
          </div>
        </div>

        <div id="productos-temporada" className="mt-8 scroll-mt-6">
          <ProductCarousel products={seasonalProducts} labelledBy="featured-products-heading" />
        </div>
      </section>
    </>
  );
}
