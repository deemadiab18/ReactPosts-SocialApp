import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import type { Comment } from "../../types/api";

type CommentItemProps = {
  postId: string;
  comment: Comment;
  isOwner: boolean;
  onDelete: (commentId: string) => Promise<void>;
  onEdit?: (comment: Comment) => void;
};

export default function CommentItem({
  comment,
  isOwner,
  onDelete,
  onEdit,
}: CommentItemProps) {
  const author = comment.user;
  if (!comment._id || !author?._id) return null;

  return (
    <article className="home-card p-4">
      <header className="flex items-center gap-2">
        <img src={author.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{author.name}</p>
          <p className="text-xs text-slate-500">{formatTimeAgo(comment.createdAt)}</p>
        </div>
      </header>
      <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
        {comment.content}
      </p>
      {comment.image && (
        <img src={comment.image} alt="" className="mt-2 max-h-52 rounded-lg object-cover" />
      )}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
        <button type="button" className="hover:text-brand-600">
          Like
        </button>
        <button type="button" className="hover:text-brand-600">
          Reply
        </button>
        {isOwner && (
          <>
            <button
              type="button"
              className="hover:text-brand-600"
              onClick={() => onEdit?.(comment)}
            >
              Edit
            </button>
            <ConfirmDeleteModal
              title="Delete comment?"
              description="This comment will be removed permanently."
              triggerLabel="Delete"
              onConfirm={() => onDelete(comment._id)}
            />
          </>
        )}
      </div>
    </article>
  );
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}