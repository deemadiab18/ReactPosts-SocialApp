import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import type { Post } from "../../types/api";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { CommentIcon, HeartIcon, ShareIcon } from "../layout/NavIcons";

type PostCardProps = {
  post: Post;
  isOwner: boolean;
  onDelete: (postId: string) => Promise<void>;
  onEdit?: (post: Post) => void;
  variant?: "feed" | "default" | "detail";
};

export default function PostCard({
  post,
  isOwner,
  onDelete,
  onEdit,
  variant = "feed",
}: PostCardProps) {
  const likeCount = typeof post.likes === "number" ? post.likes : 0;
  const commentCount =
    typeof post.comments === "number"
      ? post.comments
      : Array.isArray(post.comments)
        ? post.comments.length
        : 0;

  return (
    <article className="home-card overflow-hidden">
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <p className="mt-3 whitespace-pre-wrap px-4 text-[15px] leading-relaxed text-slate-800 dark:text-slate-100">
        {post.body}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt="Post attachment"
          className="mt-3 w-full max-h-[420px] object-cover"
        />
      )}

      {(variant === "feed" || variant === "detail") && (
        <FeedActions
          likeCount={likeCount}
          commentCount={commentCount}
          postId={post._id}
          linkComments={variant === "feed"}
        />
      )}

      {variant === "default" && (
        <div className="mt-4 flex flex-wrap items-center gap-2 px-4 pb-4">
          <Link
            to={`/posts/${post._id}`}
            className="text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            View comments
          </Link>
        </div>
      )}

      {isOwner && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-2 dark:border-brand-700">
          <Button size="sm" variant="tertiary" onPress={() => onEdit?.(post)}>
            Edit
          </Button>
          <ConfirmDeleteModal
            title="Delete post?"
            description="This action cannot be undone."
            triggerLabel="Delete"
            onConfirm={() => onDelete(post._id)}
          />
        </div>
      )}
    </article>
  );
}

function FeedActions({
  likeCount,
  commentCount,
  postId,
  linkComments = true,
}: {
  likeCount: number;
  commentCount: number;
  postId: string;
  linkComments?: boolean;
}) {
  const commentLabel = (
    <>
      <CommentIcon />
      {commentCount > 0 ? commentCount : "Comment"}
    </>
  );
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-sm font-semibold text-slate-600 dark:border-brand-700 dark:text-slate-300">
        <button type="button" className="inline-flex items-center gap-1.5 hover:text-brand-600">
          <HeartIcon />
          {likeCount > 0 ? likeCount : "Like"}
        </button>
        {linkComments ? (
          <Link
            to={`/posts/${postId}`}
            className="inline-flex items-center gap-1.5 hover:text-brand-600"
          >
            {commentLabel}
          </Link>
        ) : (
          <a
            href="#comments"
            className="inline-flex items-center gap-1.5 hover:text-brand-600"
          >
            {commentLabel}
          </a>
        )}
        <button type="button" className="inline-flex items-center gap-1.5 hover:text-brand-600">
          <ShareIcon />
          Share
        </button>
      </div>
    </div>
  );
}

function PostHeader({
  user,
  createdAt,
}: {
  user?: Post["user"];
  createdAt: string;
}) {
  const timeAgo = formatTimeAgo(createdAt);
  if (!user) {
    return (
      <header className="px-4 pt-4">
        <p className="text-xs text-slate-500">{timeAgo}</p>
      </header>
    );
  }
  return (
    <header className="flex items-center gap-3 px-4 pt-4">
      <img
        src={user.photo}
        alt={user.name}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100"
      />
      <div>
        <p className="font-bold text-slate-900 dark:text-slate-50">{user.name}</p>
        <p className="text-xs text-slate-500">
          @{user.username} · {timeAgo}
        </p>
      </div>
    </header>
  );
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}