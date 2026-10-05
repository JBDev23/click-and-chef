import { View, Text, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-4xl text-mercadona-green font-mercadona-logo mb-4 text-center font-bold">
        MERCADONA
      </Text>
      
      <Text className="text-lg text-gray-700 font-mercadona-text mb-8 text-center">
        Hemos configurado los colores y tipografías en la app móvil usando NativeWind.
      </Text>
      
      <View className="flex-row gap-4">
        <TouchableOpacity className="px-6 py-3 bg-mercadona-green rounded-lg">
          <Text className="text-white font-bold text-center text-lg">Comprar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="px-6 py-3 bg-mercadona-orange rounded-lg">
          <Text className="text-white font-bold text-center text-lg">Descubrir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
