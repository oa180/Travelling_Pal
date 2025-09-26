import { USE_API } from "@/api/config";
import { UsersAPI } from "@/api/users";

export class User {
  static async me() {
    if (USE_API) {
      try {
        return await UsersAPI.me();
      } catch (e) {
        console.warn("Falling back to placeholder user due to API error:", e.message);
      }
    }
    return { name: "Current User" };
  }
}
