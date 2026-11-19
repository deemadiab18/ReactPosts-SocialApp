import type { ApiResponse, Post } from "../types/api";
import { api } from "./axios";
import { normalizePosts } from "./normalizePost";
import { normalizeApiUser, normalizeProfileData } from "./normalizeUser";

export async function getProfileData(fallbackPhoto?: string | null) {
  const { data } = await api.get<ApiResponse<unknown>>("/users/profile-data");
  return {
    ...data,
    data: normalizeProfileData(data.data, fallbackPhoto),
  };
}

export async function getUserProfile(userId: string, fallbackPhoto?: string | null) {
  const { data } = await api.get<ApiResponse<unknown>>(`/users/${userId}/profile`);
  return {
    ...data,
    data: normalizeProfileData(data.data, fallbackPhoto),
  };
}

export async function getUserPosts(userId: string) {
  const { data } = await api.get<ApiResponse<{ posts: Post[] }>>(
    `/users/${userId}/posts`,
  );
  return {
    ...data,
    data: {
      posts: normalizePosts(data.data.posts ?? []),
    },
  };
}

export async function uploadProfilePhoto(file: File) {
  const form = new FormData();
  form.append("photo", file);
  const { data } = await api.put<ApiResponse<unknown>>("/users/upload-photo", form);
  const user = normalizeApiUser(data.data);
  if (!user) throw new Error("Invalid upload response");
  return { ...data, data: user };
}