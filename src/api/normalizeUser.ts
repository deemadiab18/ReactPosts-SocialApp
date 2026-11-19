import type { ApiUser, ProfileData } from "../types/api";
import { DEFAULT_PROFILE_PHOTO, resolvePhotoUrl } from "../utils/resolvePhotoUrl";

function unwrapUserRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  if (root.user && typeof root.user === "object") {
    return root.user as Record<string, unknown>;
  }
  if (root.profile && typeof root.profile === "object") {
    return root.profile as Record<string, unknown>;
  }
  return root;
}

export function normalizeApiUser(raw: unknown): ApiUser | null {
  const u = unwrapUserRecord(raw);
  if (!u) return null;
  const id = u._id ?? u.id;
  if (typeof id !== "string") return null;

  const photoRaw = u.photo ?? u.profilePhoto ?? u.avatar;
  return {
    _id: id,
    name: String(u.name ?? ""),
    username: String(u.username ?? ""),
    email: String(u.email ?? ""),
    photo: resolvePhotoUrl(typeof photoRaw === "string" ? photoRaw : undefined),
    cover:
      typeof u.cover === "string" ? resolvePhotoUrl(u.cover) : undefined,
    dateOfBirth: typeof u.dateOfBirth === "string" ? u.dateOfBirth : undefined,
    gender: u.gender === "male" || u.gender === "female" ? u.gender : undefined,
    createdAt: typeof u.createdAt === "string" ? u.createdAt : undefined,
  };
}

export function normalizeProfileData(
  raw: unknown,
  fallbackPhoto?: string | null,
): ProfileData {
  const user = normalizeApiUser(raw);
  if (!user) throw new Error("Invalid profile payload");

  const u = unwrapUserRecord(raw) ?? {};
  let photo = user.photo;
  if (photo === DEFAULT_PROFILE_PHOTO && fallbackPhoto) {
    photo = resolvePhotoUrl(fallbackPhoto);
  }

  return {
    ...user,
    photo,
    followers: typeof u.followers === "number" ? u.followers : undefined,
    following: typeof u.following === "number" ? u.following : undefined,
    posts: Array.isArray(u.posts) ? (u.posts as ProfileData["posts"]) : undefined,
  };
}