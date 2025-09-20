export class Company {
  static schema = {
    name: "Company",
    type: "object",
    properties: {
      company_name: { type: "string", description: "Travel company name" },
      company_type: {
        type: "string",
        enum: ["travel_agency", "hotel", "transport", "tour_operator"],
        description: "Type of travel service provider",
      },
      contact_email: { type: "string", description: "Company contact email" },
      contact_phone: { type: "string", description: "Company contact phone" },
      address: { type: "string", description: "Company address" },
      website: { type: "string", description: "Company website URL" },
      description: { type: "string", description: "Company description" },
      logo_url: { type: "string", description: "Company logo URL" },
      is_verified: { type: "boolean", default: false, description: "Whether company is verified by platform" },
      is_active: { type: "boolean", default: true, description: "Whether company is currently active" },
      rating: { type: "number", minimum: 1, maximum: 5, description: "Company rating" },
      total_bookings: { type: "number", default: 0, description: "Total bookings received" },
      total_revenue: { type: "number", default: 0, description: "Total revenue generated" },
    },
    required: ["company_name", "company_type", "contact_email"],
  };
}