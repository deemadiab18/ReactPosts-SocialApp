import type { ApiResponse, ApiUser, Comment, CommentsListData } from "../types/api";
import { api } from "./axios";
import {
  extractRawComment,
  normalizeComment,
  normalizeComments,
} from "./normalizeComment";

function normalizeCommentsList(
  raw: ApiResponse<CommentsListData | Comment[]>,
  author?: ApiUser | null,
): Comment[] {
  const payload = raw.data;
  const list = Array.isArray(payload) ? payload : (payload.comments ?? []);
  return normalizeComments(list, author);
}

export async function getComments(
  postId: string,
  page = 1,
  limit = 10,
  author?: ApiUser | null,
) {
  const { data } = await api.get<ApiResponse<CommentsListData | Comment[]>>(
    `/posts/${postId}/comments`,
    { params: { page, limit } },
  );
  const payload = data.data;
  const total = Array.isArray(payload)
    ? payload.length
    : (payload.total ?? payload.comments?.length ?? 0);
  return {
    comments: normalizeCommentsList(data, author),
    nextPage: Array.isArray(payload) ? null : (payload.nextPage ?? null),
    total,
  };
}

export async function createComment(
  postId: string,
  form: FormData,
  author?: ApiUser | null,
) {
  const { data } = await api.post<ApiResponse<unknown>>(
    `/posts/${postId}/comments`,
    form,
  );
  const content = String(form.get("content") ?? "").trim();
  const raw = extractRawComment(data.data);
  const comment =
    (raw && normalizeComment({ ...raw, content: raw.content ?? content }, author)) ??
    (author && raw?._id
      ? {
          _id: raw._id,
          content,
          user: {
            _id: author._id,
            name: author.name,
            username: author.username,
            photo: author.photo,
          },
          createdAt: new Date().toISOString(),
        }
      : null);
  if (!comment) throw new Error("Invalid comment payload");
  return { ...data, data: comment };
}

export async function updateComment(
  postId: string,
  commentId: string,
  form: FormData,
  previous?: Comment | null,
  author?: ApiUser | null,
) {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/posts/${postId}/comments/${commentId}`,
    form,
  );
  const content = String(form.get("content") ?? previous?.content ?? "").trim();
  const raw = extractRawComment(data.data) ?? { _id: commentId };
  const comment =
    normalizeComment(
      { ...raw, _id: commentId, content: raw.content ?? content },
      author ?? previous?.user,
      previous,
    ) ?? normalizeComment({ _id: commentId, content }, author ?? previous?.user, previous);
  if (!comment) throw new Error("Invalid comment payload");
  return { ...data, data: comment };
}

export async function deleteComment(postId: string, commentId: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    `/posts/${postId}/comments/${commentId}`,
  );
  return data;
}