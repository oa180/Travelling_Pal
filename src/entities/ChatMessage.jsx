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

  static storageKey = "chat_messages";

  static _read() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  static _write(list) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }

  static async list() {
    return this._read();
  }

  static async create(data) {
    const list = await this.list();
    const nextId = String(list.length + 1);
    const created = { id: nextId, created_date: new Date().toISOString(), ...data };
    list.push(created);
    this._write(list);
    return created;
  }
}