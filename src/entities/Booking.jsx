export class Booking {
  static schema = {
    name: "Booking",
    type: "object",
    properties: {
      package_id: { type: "string", description: "Travel package ID" },
      package_title: { type: "string", description: "Travel package title" },
      traveler_name: { type: "string", description: "Lead traveler name" },
      traveler_email: { type: "string", description: "Contact email" },
      traveler_phone: { type: "string", description: "Contact phone" },
      number_of_travelers: { type: "number", description: "Total number of travelers" },
      travel_date: { type: "string", format: "date", description: "Selected travel date" },
      total_amount: { type: "number", description: "Total booking amount" },
      status: {
        type: "string",
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
        description: "Booking status",
      },
      payment_method: {
        type: "string",
        enum: ["visa", "mastercard", "paypal", "local_wallet"],
        description: "Payment method used",
      },
      special_requests: { type: "string", description: "Any special requests from traveler" },
      provider_id: { type: "string", description: "Travel provider ID" },
      provider_name: { type: "string", description: "Travel provider name" },
    },
    required: ["package_id", "traveler_name", "traveler_email", "number_of_travelers", "total_amount"],
  };
}