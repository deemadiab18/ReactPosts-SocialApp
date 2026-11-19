import type { ApiUser, Post, PostAuthor } from "../types/api";

export function mergePost(base: Post, patch: Partial<Post>): Post {
  return {
    ...base,
    ...patch,
    _id: patch._id ?? base._id,
    body: patch.body ?? base.body,
    image: patch.image !== undefined ? patch.image : base.image,
    user: patch.user ?? base.user,
    createdAt: patch.createdAt ?? base.createdAt,
    updatedAt: patch.updatedAt ?? base.updatedAt,
    comments: patch.comments ?? base.comments,
    likes: patch.likes ?? base.likes,
  };
}

export function attachAuthorIfMissing(post: Post, authUser: ApiUser | null): Post {
  if (post.user?._id || !authUser) return post;
  const user: PostAuthor = {
    _id: authUser._id,
    name: authUser.name,
    username: authUser.username,
    photo: authUser.photo,
  };
  return { ...post, user };
}

export function isPostOwner(post: Post, authUser: ApiUser | null) {
  if (!authUser?._id || !post.user?._id) return false;
  return post.user._id === authUser._id;
}