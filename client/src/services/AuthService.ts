import $api from "@/http";
import { AuthResponse } from "@/models/response/AuthResponse";
import { AxiosResponse } from "axios";

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>(
      "/auth/user/login",
      {
        username: email,
        password: password,
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }

  static async registration(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>(
      "/auth/user/registration",
      {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  }

  static async logout(): Promise<void> {
    return $api.post("/auth/user/logout", {
      headers: { "Content-Type": "application/json" },
    });
  }
}
