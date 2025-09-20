
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const destinations = [
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    rating: 4.8,
    price: "From $899",
    description: "Tropical paradise with pristine beaches"
  },
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop",
    rating: 4.9,
    price: "From $1,299",
    description: "City of love and timeless elegance"
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop",
    rating: 4.7,
    price: "From $1,599",
    description: "Modern culture meets ancient traditions"
  },
  {
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=250&fit=crop",
    rating: 4.9,
    price: "From $1,199",
    description: "Stunning sunsets and white-washed villages"
  }
];

export default function DestinationSuggestions() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing places loved by travelers worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {destination.name}
                      </h3>
                      <div className="text-blue-600 font-bold text-sm">
                        {destination.price}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>View packages</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}