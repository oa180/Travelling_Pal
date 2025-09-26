import { USE_API } from "@/api/config";
import { BookingsAPI } from "@/api/bookings";

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

  static storageKey = "bookings";

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

  static async list(orderBy) {
    if (USE_API) {
      try {
        const data = await BookingsAPI.list();
        return Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn("Falling back to local bookings due to API error:", e.message);
      }
    }
    return this._read();
  }

  static async get(id) {
    if (USE_API) {
      try {
        return await BookingsAPI.get(id);
      } catch (e) {
        console.warn("Falling back to local booking get due to API error:", e.message);
      }
    }
    const list = await this.list();
    return list.find((b) => String(b.id) === String(id)) || null;
  }

  static async create(data) {
    if (USE_API) {
      try {
        return await BookingsAPI.create(data);
      } catch (e) {
        console.warn("Falling back to local booking create due to API error:", e.message);
      }
    }
    const list = await this.list();
    const nextId = String(
      list.reduce((max, b) => Math.max(max, Number(b.id) || 0), 0) + 1
    );
    const created = {
      id: nextId,
      created_date: new Date().toISOString(),
      status: "confirmed",
      ...data,
    };
    list.push(created);
    this._write(list);
    return created;
  }

  static async update(id, data) {
    if (USE_API) {
      try {
        return await BookingsAPI.update(id, data);
      } catch (e) {
        console.warn("Falling back to local booking update due to API error:", e.message);
      }
    }
    const list = await this.list();
    const idx = list.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    this._write(list);
    return list[idx];
  }

  static async delete(id) {
    if (USE_API) {
      try {
        await BookingsAPI.delete(id);
        return true;
      } catch (e) {
        console.warn("Falling back to local booking delete due to API error:", e.message);
      }
    }
    const list = await this.list();
    const filtered = list.filter((b) => String(b.id) !== String(id));
    this._write(filtered);
    return true;
  }
}