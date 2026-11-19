import type { ApiUser, Post, PostAuthor } from "../types/api";

type RawPost = Partial<Post> & {
  _id: string;
  user?: PostAuthor | string;
  createdBy?: PostAuthor;
  author?: PostAuthor;
};

export function extractRawPost(payload: unknown): RawPost | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload as Record<string, unknown>;

  if (typeof value._id === "string") {
    return value as RawPost;
  }

  if (typeof value.id === "string") {
    return { ...(value as RawPost), _id: value.id };
  }

  if (value.post && typeof value.post === "object") {
    const nested = value.post as Record<string, unknown>;
    if (typeof nested._id === "string") return nested as RawPost;
    if (typeof nested.id === "string") return { ...(nested as RawPost), _id: nested.id };
  }

  return null;
}

function toAuthor(user: ApiUser | PostAuthor): PostAuthor {
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    photo: user.photo,
  };
}

function isAuthor(value: unknown): value is PostAuthor {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof (value as PostAuthor)._id === "string"
  );
}

export function normalizePost(
  raw: RawPost,
  fallbackAuthor?: ApiUser | PostAuthor | null,
  previous?: Post | null,
): Post | null {
  if (!raw?._id) return null;

  const body = raw.body ?? previous?.body;
  if (!body) return null;

  let user: PostAuthor | undefined;
  if (isAuthor(raw.user)) user = raw.user;
  else if (isAuthor(raw.createdBy)) user = raw.createdBy;
  else if (isAuthor(raw.author)) user = raw.author;
  else if (previous?.user) user = previous.user;
  else if (fallbackAuthor) user = toAuthor(fallbackAuthor);

  if (!user?._id) return null;

  return {
    _id: raw._id,
    body,
    image: raw.image ?? previous?.image,
    user,
    createdAt: raw.createdAt ?? previous?.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? previous?.updatedAt,
    comments: raw.comments ?? previous?.comments,
    likes: raw.likes ?? previous?.likes,
  };
}

export function normalizePosts(
  items: RawPost[],
  fallbackAuthor?: ApiUser | PostAuthor | null,
): Post[] {
  return items
    .map((item) => normalizePost(item, fallbackAuthor))
    .filter((post): post is Post => post !== null);
}