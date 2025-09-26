import { USE_API } from "@/api/config";
import { PackagesAPI } from "@/api/packages";
import { mapOffersListToTravelPackages, mapOfferToTravelPackage } from "@/api/mappers";

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

  // Simple localStorage-backed mock implementation so the app can run
  static storageKey = "travel_packages";

  static defaultPackages() {
    return [
      {
        id: "1",
        title: "Bali Escape",
        destination: "Bali, Indonesia",
        description: "7-day tropical getaway with beaches and temples.",
        price: 899,
        original_price: 1099,
        image_url:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop",
        available_dates: ["2025-10-05", "2025-11-12", "2026-01-20"],
        duration_days: 7,
        star_rating: 4.8,
        transport_type: "flight",
        accommodation_level: "standard",
        max_travelers: 12,
        includes: ["Flights", "Hotel", "Breakfast", "Airport Transfers"],
        provider_id: "prov_1",
        provider_name: "Island Tours",
        is_active: true,
        country: "Indonesia",
        continent: "Asia",
      },
      {
        id: "2",
        title: "Paris City Lights",
        destination: "Paris, France",
        description: "5 days in the City of Love with museum passes.",
        price: 1299,
        original_price: 1499,
        image_url:
          "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=800&fit=crop",
        available_dates: ["2025-09-15", "2025-12-01", "2026-02-10"],
        duration_days: 5,
        star_rating: 4.9,
        transport_type: "flight",
        accommodation_level: "premium",
        max_travelers: 8,
        includes: ["Flights", "Hotel", "Breakfast", "Museum Pass"],
        provider_id: "prov_2",
        provider_name: "Elegance Travel",
        is_active: true,
        country: "France",
        continent: "Europe",
      },
      {
        id: "3",
        title: "Tokyo Discovery",
        destination: "Tokyo, Japan",
        description: "6-day culture and cuisine experience in Tokyo.",
        price: 1599,
        original_price: 1799,
        image_url:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop",
        available_dates: ["2025-11-05", "2026-01-15", "2026-03-22"],
        duration_days: 6,
        star_rating: 4.7,
        transport_type: "flight",
        accommodation_level: "luxury",
        max_travelers: 10,
        includes: ["Flights", "Hotel", "Breakfast", "City Tour"],
        provider_id: "prov_3",
        provider_name: "Nippon Adventures",
        is_active: true,
        country: "Japan",
        continent: "Asia",
      },
      {
        id: "4",
        title: "Santorini Sunsets",
        destination: "Santorini, Greece",
        description: "4-day romantic escape with caldera views.",
        price: 1199,
        original_price: 1399,
        image_url:
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&h=800&fit=crop",
        available_dates: ["2025-09-28", "2025-10-18", "2026-04-05"],
        duration_days: 4,
        star_rating: 4.9,
        transport_type: "flight",
        accommodation_level: "premium",
        max_travelers: 6,
        includes: ["Flights", "Hotel", "Breakfast", "Sunset Cruise"],
        provider_id: "prov_4",
        provider_name: "Aegean Getaways",
        is_active: true,
        country: "Greece",
        continent: "Europe",
      },
    ];
  }

  static _read() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
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
        const data = await PackagesAPI.list();
        return mapOffersListToTravelPackages(data);
      } catch (e) {
        console.warn("Falling back to local packages due to API error:", e.message);
      }
    }
    let list = this._read();
    if (!Array.isArray(list) || list.length === 0) {
      list = this.defaultPackages();
      this._write(list);
    }
    return list;
  }

  static async get(id) {
    if (USE_API) {
      try {
        const offer = await PackagesAPI.get(id);
        return mapOfferToTravelPackage(offer);
      } catch (e) {
        console.warn("Falling back to local package get due to API error:", e.message);
      }
    }
    const list = await this.list();
    return list.find((p) => String(p.id) === String(id)) || null;
  }

  static async create(data) {
    if (USE_API) {
      try {
        // Use company endpoint per Swagger
        return await PackagesAPI.companyCreate(data);
      } catch (e) {
        console.warn("Falling back to local package create due to API error:", e.message);
      }
    }
    const list = await this.list();
    const nextId = String(
      list.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1
    );
    const newPkg = { id: nextId, is_active: true, ...data };
    list.push(newPkg);
    this._write(list);
    return newPkg;
  }

  static async update(id, data) {
    if (USE_API) {
      try {
        // Use company endpoint per Swagger
        return await PackagesAPI.companyUpdate(id, data);
      } catch (e) {
        console.warn("Falling back to local package update due to API error:", e.message);
      }
    }
    const list = await this.list();
    const idx = list.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    this._write(list);
    return list[idx];
  }

  static async delete(id) {
    if (USE_API) {
      try {
        await PackagesAPI.delete(id);
        return true;
      } catch (e) {
        console.warn("Falling back to local package delete due to API error:", e.message);
      }
    }
    const list = await this.list();
    const filtered = list.filter((p) => String(p.id) !== String(id));
    this._write(filtered);
    return true;
  }

  // Optional server-side search using /search_offers when API is enabled
  static async search(query) {
    if (USE_API) {
      try {
        const body = query && typeof query === 'object' ? query : { q: String(query || "") };
        const data = await PackagesAPI.search(body);
        return mapOffersListToTravelPackages(data);
      } catch (e) {
        console.warn("Falling back to local packages due to API error in search:", e.message);
      }
    }
    // Fallback: client-side filter over local list
    const list = await this.list();
    const q = (query?.q ?? query ?? "").toString().toLowerCase();
    if (!q) return list;
    return list.filter((pkg) =>
      pkg.title?.toLowerCase().includes(q) ||
      pkg.destination?.toLowerCase().includes(q) ||
      pkg.country?.toLowerCase().includes(q)
    );
  }
}