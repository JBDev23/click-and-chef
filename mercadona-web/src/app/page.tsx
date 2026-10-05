import Image from "next/image";
import { Search, ChevronDown, ShoppingCart, MessageCircleQuestion, Plus, MapPin, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      {/* Floating Help Button */}
      <button className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-mercadona-green text-white px-4 py-2.5 rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors">
        <MessageCircleQuestion size={24} />
        <span>Ayuda</span>
      </button>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
          <div className="w-48 flex-shrink-0 cursor-pointer">
            <Image
              src="/mercadona-logo.svg"
              alt="Mercadona Logo"
              width={200}
              height={40}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar productos"
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-mercadona-green focus:bg-white transition-all"
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-gray-700 font-bold ml-2">
            <a href="#" className="hover:text-mercadona-green transition-colors">Categorías</a>
            <a href="#" className="hover:text-mercadona-green transition-colors">Listas</a>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-6 ml-8">
          <button className="flex items-center gap-1 font-bold text-gray-800 hover:text-mercadona-green transition-colors">
            Identifícate
            <ChevronDown size={20} />
          </button>
          
          <button className="p-2 text-gray-800 hover:text-mercadona-green transition-colors relative">
            <ShoppingCart size={28} />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-6">
        {/* Notice Banner */}
        <div className="bg-[#f0f7f4] border border-[#d2e8de] rounded-lg p-4 flex items-center gap-4 mb-8">
          <div className="bg-mercadona-green text-white p-2 rounded-full">
            <MapPin size={20} />
          </div>
          <p className="text-gray-800">
            Identifícate y añade tu dirección para conocer la próxima entrega disponible{" "}
            <a href="#" className="font-bold text-mercadona-green hover:underline">Identifícate</a>
          </p>
        </div>

        {/* Productos del momento */}
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Productos del momento</h2>
            <p className="text-gray-500 text-sm mt-1">Selección de productos destacados</p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden h-[300px] bg-gray-900 group cursor-pointer">
            <img 
              src="https://prod-mercadona.imgix.net/images/cca7d1157fce04561b54f6e02d70ebd6.jpg?h=500" 
              alt="Halloween Banner" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-12 flex flex-col justify-center items-start">
              <h3 className="text-4xl font-bold text-white mb-6 max-w-md leading-tight">
                ¡Boo! Llega Halloween
              </h3>
              <button className="bg-[#7DA9DB] hover:bg-[#6c98ca] text-white font-bold py-2.5 px-6 rounded-full transition-colors">
                Ver productos
              </button>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 mb-10" />

        {/* Novedades Carousel */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Novedades</h2>
              <p className="text-gray-500 text-sm mt-1">Productos recién añadidos o mejorados</p>
            </div>
            <a href="#" className="flex items-center text-mercadona-green font-bold hover:underline">
              Ver todas las novedades
              <ChevronRight size={20} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Product 1 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80" alt="Caramelos" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Surtido de caramelos Mix El Conde Drácula y Zombie Lokopop Cerdán</h3>
                <p className="text-xs text-gray-500 mb-2">Paquete 150 g</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">1,35 €</span>
                    <span className="text-sm text-gray-500"> /ud.</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>

            {/* Product 2 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80" alt="Galletas" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Barquillos de cacao rellenos con crema de leche y avellanas Knoppers</h3>
                <p className="text-xs text-gray-500 mb-2">5 paquetes x 25 g</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">1,25 €</span>
                    <span className="text-sm text-gray-500"> /pack</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>

            {/* Product 3 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80" alt="Chocolate" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Chocolate con leche Fussion Hacendado relleno de caramelo</h3>
                <p className="text-xs text-gray-500 mb-2">Paquete 95 g</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">1,35 €</span>
                    <span className="text-sm text-gray-500"> /ud.</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>

            {/* Product 4 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1602491453631-e2a5690ecd74?w=400&q=80" alt="Guanciale" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Guanciale Hacendado</h3>
                <p className="text-xs text-gray-500 mb-2">Pieza 250 g aprox.</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">3,75 €</span>
                    <span className="text-sm text-gray-500"> /ud.</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>

            {/* Product 5 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1623328212140-62141506eb32?w=400&q=80" alt="Barritas" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Barritas crujientes Crunchy Milk Hacendado</h3>
                <p className="text-xs text-gray-500 mb-2">Paquete 8 ud. (92 g)</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">1,80 €</span>
                    <span className="text-sm text-gray-500"> /ud.</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>

            {/* Product 6 */}
            <div className="group flex flex-col border border-transparent hover:border-gray-200 rounded-xl p-3 transition-colors h-full cursor-pointer relative">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80" alt="Cheesecake barritas" className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-sm text-gray-800 font-medium mb-1 line-clamp-3">Barritas de barquillo Cheesecake Caramel Hacendado</h3>
                <p className="text-xs text-gray-500 mb-2">Paquete 5 ud. (115 g)</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">1,80 €</span>
                    <span className="text-sm text-gray-500"> /ud.</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-mercadona-green text-mercadona-green font-bold py-1.5 rounded-full hover:bg-mercadona-green hover:text-white transition-colors">
                Añadir al carro
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
