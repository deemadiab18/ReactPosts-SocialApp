import type { ApiResponse, AuthPayload } from "../types/api";
import { api } from "./axios";

export type SignUpBody = {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  password: string;
  rePassword: string;
};

export type SignInBody = {
  email: string;
  password: string;
};

export type ChangePasswordBody = {
  password: string;
  newPassword: string;
};

export async function signUp(body: SignUpBody) {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/users/signup", body);
  return data;
}

export async function signIn(body: SignInBody) {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/users/signin", body);
  return data;
}

export async function changePassword(body: ChangePasswordBody) {
  const { data } = await api.patch<ApiResponse<AuthPayload>>(
    "/users/change-password",
    body,
  );
  return data;
}