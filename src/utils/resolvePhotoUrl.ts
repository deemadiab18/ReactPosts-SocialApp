export const DEFAULT_PROFILE_PHOTO =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export function resolvePhotoUrl(photo?: string | null): string {
  const trimmed = photo?.trim();
  if (!trimmed) return DEFAULT_PROFILE_PHOTO;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = (
    import.meta.env.VITE_API_BASE_URL ?? "https://route-posts.routemisr.com"
  ).replace(/\/$/, "");
  return `${base}/${trimmed.replace(/^\//, "")}`;
}