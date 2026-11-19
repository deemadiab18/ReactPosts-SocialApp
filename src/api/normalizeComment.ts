import type { ApiUser, Comment, PostAuthor } from "../types/api";

type RawComment = Partial<Comment> & {
  _id: string;
  user?: PostAuthor | string;
  createdBy?: PostAuthor;
  author?: PostAuthor;
};

export function extractRawComment(payload: unknown): RawComment | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload as Record<string, unknown>;

  if (typeof value._id === "string") {
    return value as RawComment;
  }

  if (typeof value.id === "string") {
    return { ...(value as RawComment), _id: value.id };
  }

  if (value.comment && typeof value.comment === "object") {
    const nested = value.comment as Record<string, unknown>;
    if (typeof nested._id === "string") return nested as RawComment;
    if (typeof nested.id === "string") return { ...(nested as RawComment), _id: nested.id };
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

export function normalizeComment(
  raw: RawComment,
  fallbackAuthor?: ApiUser | PostAuthor | null,
  previous?: Comment | null,
): Comment | null {
  if (!raw?._id) return null;

  const content = raw.content ?? previous?.content;
  if (!content) return null;

  let user: PostAuthor | undefined;
  if (isAuthor(raw.user)) user = raw.user;
  else if (isAuthor(raw.createdBy)) user = raw.createdBy;
  else if (isAuthor(raw.author)) user = raw.author;
  else if (previous?.user) user = previous.user;
  else if (fallbackAuthor) user = toAuthor(fallbackAuthor);

  if (!user?._id) return null;

  return {
    _id: raw._id,
    content,
    image: raw.image ?? previous?.image,
    user,
    post: raw.post ?? previous?.post,
    createdAt: raw.createdAt ?? previous?.createdAt ?? new Date().toISOString(),
  };
}

export function normalizeComments(
  items: unknown[],
  fallbackAuthor?: ApiUser | PostAuthor | null,
): Comment[] {
  return items
    .map((item) => {
      const raw =
        extractRawComment(item) ??
        (item && typeof item === "object" && "_id" in item ? (item as RawComment) : null);
      return raw ? normalizeComment(raw, fallbackAuthor) : null;
    })
    .filter((comment): comment is Comment => comment !== null);
}