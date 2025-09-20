export class TravelPackage {
  static schema = {
    name: "TravelPackage",
    type: "object",
    properties: {
      title: { type: "string", description: "Package name" },
      destination: { type: "string", description: "Travel destination" },
      description: { type: "string", description: "Package description" },
      price: { type: "number", description: "Package price in USD" },
      original_price: { type: "number", description: "Original price before discount" },
      image_url: { type: "string", description: "Destination image URL" },
      available_dates: {
        type: "array",
        items: { type: "string", format: "date" },
        description: "Available travel dates",
      },
      duration_days: { type: "number", description: "Trip duration in days" },
      star_rating: { type: "number", minimum: 1, maximum: 5, description: "Package rating" },
      transport_type: {
        type: "string",
        enum: ["flight", "bus", "train", "car"],
        description: "Transportation mode",
      },
      accommodation_level: {
        type: "string",
        enum: ["budget", "standard", "luxury", "premium"],
        description: "Accommodation quality",
      },
      max_travelers: { type: "number", description: "Maximum number of travelers" },
      includes: { type: "array", items: { type: "string" }, description: "What's included in the package" },
      provider_id: { type: "string", description: "Travel provider company ID" },
      provider_name: { type: "string", description: "Travel provider company name" },
      is_active: { type: "boolean", default: true, description: "Whether package is currently available" },
      country: { type: "string", description: "Destination country" },
      continent: { type: "string", description: "Destination continent" },
    },
    required: ["title", "destination", "price", "star_rating"],
  };
}