export class ChatMessage {
  static schema = {
    name: "ChatMessage",
    type: "object",
    properties: {
      message: { type: "string", description: "User message content" },
      response: { type: "string", description: "AI assistant response" },
      intent: {
        type: "string",
        enum: ["search", "budget_inquiry", "destination_request", "booking_help", "general"],
        description: "Detected user intent",
      },
      extracted_data: {
        type: "object",
        properties: {
          budget: { type: "number" },
          destination: { type: "string" },
          travel_date: { type: "string" },
          travelers: { type: "number" },
        },
        description: "Extracted travel preferences",
      },
      session_id: { type: "string", description: "Chat session identifier" },
    },
    required: ["message", "response"],
  };
}