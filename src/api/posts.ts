import type { ApiResponse, ApiUser, Post, PostsListData } from "../types/api";
import { api } from "./axios";
import { extractRawPost, normalizePost, normalizePosts } from "./normalizePost";

function normalizePostsList(raw: ApiResponse<PostsListData | Post[]>, author?: ApiUser | null): Post[] {
  const payload = raw.data;
  const list = Array.isArray(payload) ? payload : (payload.posts ?? []);
  return normalizePosts(list, author);
}

function paginationMeta(raw: ApiResponse<PostsListData | Post[]>) {
  const payload = raw.data;
  if (Array.isArray(payload)) {
    return { nextPage: null as number | null };
  }
  return { nextPage: payload.nextPage ?? null };
}

export async function getPosts(page = 1, limit = 10, author?: ApiUser | null) {
  const { data } = await api.get<ApiResponse<PostsListData | Post[]>>("/posts", {
    params: { page, limit },
  });
  return {
    posts: normalizePostsList(data, author),
    ...paginationMeta(data),
    message: data.message,
  };
}

export async function getFollowingFeed(page = 1, limit = 10, author?: ApiUser | null) {
  const { data } = await api.get<ApiResponse<PostsListData | Post[]>>("/posts/feed", {
    params: { only: "following", page, limit },
  });
  return {
    posts: normalizePostsList(data, author),
    ...paginationMeta(data),
    message: data.message,
  };
}

export async function getPost(postId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/posts/${postId}`);
  const raw = extractRawPost(data.data);
  if (!raw) throw new Error("Invalid post payload");
  const post = normalizePost(raw);
  if (!post) throw new Error("Invalid post payload");
  return { ...data, data: post };
}

export async function createPost(form: FormData, author?: ApiUser | null) {
  const { data } = await api.post<ApiResponse<unknown>>("/posts", form);
  const body = String(form.get("body") ?? "").trim();
  const raw = extractRawPost(data.data);
  const post =
    (raw && normalizePost({ ...raw, body: raw.body ?? body }, author)) ??
    (author && raw?._id
      ? ({
          _id: raw._id,
          body,
          user: {
            _id: author._id,
            name: author.name,
            username: author.username,
            photo: author.photo,
          },
          createdAt: new Date().toISOString(),
        } satisfies Post)
      : null);
  if (!post) throw new Error("Invalid post payload");
  return { ...data, data: post };
}

export async function updatePost(postId: string, form: FormData, previous: Post) {
  const { data } = await api.put<ApiResponse<unknown>>(`/posts/${postId}`, form);
  const raw = extractRawPost(data.data) ?? { _id: postId };
  const post =
    normalizePost({ ...raw, _id: postId, body: raw.body ?? String(form.get("body") ?? previous.body) }, previous.user, previous) ??
    normalizePost({ _id: postId, body: String(form.get("body") ?? previous.body) }, previous.user, previous);
  if (!post) throw new Error("Invalid post payload");
  return { ...data, data: post };
}

export async function deletePost(postId: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/posts/${postId}`);
  return data;
}
