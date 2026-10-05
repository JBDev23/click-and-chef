import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Search, ShoppingCart } from 'lucide-react';

const shell =
  'home-shell grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-3 lg:h-[70px] lg:grid-cols-[auto_minmax(0,1fr)_auto_auto] lg:gap-x-10 lg:py-0';

export function MercadonaHeader() {
  return (
    <header className="border-b border-[#e6e6e6] bg-white">
      <div className={shell}>
        <Link
          href="/"
          className="col-start-1 row-start-1 block w-[148px] shrink-0 rounded-sm sm:w-[190px] lg:w-[255px]"
        >
          <Image
            src="/mercadona-logo.svg"
            alt="Mercadona"
            width={255}
            height={44}
            priority
            unoptimized
            className="h-auto w-full"
          />
        </Link>

        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-4 text-[#333333] sm:gap-6 lg:col-start-4 lg:gap-8">
          <button
            id="identificate"
            type="button"
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm text-[15px] font-normal lg:text-[16px]"
          >
            Identifícate
            <ChevronDown aria-hidden="true" className="size-[18px]" />
          </button>
          <button type="button" aria-label="Carrito" className="rounded-sm p-1 text-[#333333]">
            <ShoppingCart aria-hidden="true" className="size-[26px]" strokeWidth={1.75} />
          </button>
        </div>

        <div
          role="search"
          className="col-span-3 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1"
        >
          <label htmlFor="catalog-search" className="sr-only">
            Buscar productos o platos
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#8a8a8a]"
            />
            <input
              id="catalog-search"
              type="search"
              placeholder="Buscar productos o platos"
              className="h-11 w-full rounded-full bg-[#f3f3f3] pr-4 pl-11 text-[15px] text-[#333333] placeholder:text-[#8d8d8d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent"
            />
          </div>
        </div>

        <nav
          aria-label="Secciones"
          className="col-span-3 row-start-3 flex items-center gap-6 text-[15px] font-normal text-[#333333] lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:gap-12 lg:text-[16px]"
        >
          <a href="#categorias" className="rounded-sm whitespace-nowrap">
            Categorías
          </a>
          <a href="#listas" className="rounded-sm whitespace-nowrap">
            Listas
          </a>
        </nav>
      </div>
    </header>
  );
}
