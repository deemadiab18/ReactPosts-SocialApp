import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLoader from "../../components/ui/AppLoader";
import { deleteComment, getComments } from "../../api/comments";
import { deletePost, getPost } from "../../api/posts";
import CommentComposer from "../../components/comments/CommentComposer";
import CommentItem from "../../components/comments/CommentItem";
import FeedRightRail from "../../components/feed/FeedRightRail";
import PostCard from "../../components/posts/PostCard";
import PostEditorModal from "../../components/posts/PostEditorModal";
import CommentEditorModal from "../../components/comments/CommentEditorModal";
import { useAuth } from "../../hooks/useAuth";
import type { Comment, Post } from "../../types/api";
import { isPostOwner, mergePost } from "../../utils/mergePost";

const COMMENTS_PER_PAGE = 10;

export default function PostDetails() {
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotal, setCommentTotal] = useState(0);
  const [commentPages, setCommentPages] = useState(1);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editingPost, setEditingPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    if (!postId) return;
    const postRes = await getPost(postId);
    setPost(postRes.data);
  }, [postId]);

  const loadComments = useCallback(
    async (page: number) => {
      if (!postId) return;
      setCommentsLoading(true);
      try {
        const commentsRes = await getComments(postId, page, COMMENTS_PER_PAGE, user);
        setComments(commentsRes.comments);
        setCommentTotal(commentsRes.total);
        const pages = Math.max(1, Math.ceil(commentsRes.total / COMMENTS_PER_PAGE));
        setCommentPages(commentsRes.nextPage ? Math.max(pages, page + 1) : pages);
      } finally {
        setCommentsLoading(false);
      }
    },
    [postId, user],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      if (!postId) return;
      try {
        setLoading(true);
        await loadPost();
        setError("");
      } catch {
        setError("Post not found or unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadPost, postId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!postId || loading) return;
      await loadComments(commentPage);
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, [commentPage, loadComments, loading, postId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <AppLoader size={80} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="home-card p-6 text-center text-red-700">
        {error}
        <Link to="/" className="mt-2 block font-bold text-brand-600">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const displayCount = commentTotal || comments.length;

  return (
    <div className="feed-layout">
      <div className="min-w-0 space-y-5">
        <header>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Post details</h1>
          <Link to="/" className="mt-1 inline-block text-sm font-bold text-brand-600 hover:underline">
            ← Back to feed
          </Link>
        </header>

        <PostCard
          post={post}
          variant="detail"
          isOwner={isPostOwner(post, user)}
          onEdit={() => setEditingPost(true)}
          onDelete={async () => {
            await deletePost(post._id);
            window.location.assign("/");
          }}
        />

        {user && (
          <>
            <PostEditorModal
              mode="edit"
              isOpen={editingPost}
              onOpenChange={setEditingPost}
              user={user}
              initialPost={post}
              onSuccess={(updated) => {
                setPost(mergePost(post, updated));
                setEditingPost(false);
              }}
              onDelete={async () => {
                await deletePost(post._id);
                window.location.assign("/");
              }}
            />

            {postId && (
              <CommentComposer
                postId={postId}
                userPhoto={user.photo}
                user={user}
                onSuccess={(c) => {
                  setComments((prev) => [c, ...prev]);
                  setCommentTotal((t) => t + 1);
                }}
              />
            )}

            {postId && editingComment && (
              <CommentEditorModal
                key={editingComment._id}
                mode="edit"
                postId={postId}
                isOpen
                onOpenChange={(open) => {
                  if (!open) setEditingComment(null);
                }}
                user={user}
                initialComment={editingComment}
                onSuccess={(c) => {
                  setComments((prev) => prev.map((x) => (x._id === c._id ? c : x)));
                  setEditingComment(null);
                }}
                onDelete={async () => {
                  if (!postId) return;
                  await deleteComment(postId, editingComment._id);
                  setComments((prev) => prev.filter((c) => c._id !== editingComment._id));
                  setCommentTotal((t) => Math.max(0, t - 1));
                  setEditingComment(null);
                }}
              />
            )}
          </>
        )}

        <section id="comments" className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
            Comments ({displayCount})
          </h2>

          {commentsLoading && (
            <div className="flex justify-center py-6">
              <AppLoader size={40} />
            </div>
          )}

          {!commentsLoading &&
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                postId={postId ?? ""}
                comment={comment}
                isOwner={comment.user?._id === user?._id}
                onEdit={setEditingComment}
                onDelete={async (id) => {
                  if (!postId) return;
                  await deleteComment(postId, id);
                  setComments((prev) => prev.filter((c) => c._id !== id));
                  setCommentTotal((t) => Math.max(0, t - 1));
                }}
              />
            ))}

          {!commentsLoading && comments.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet. Start the conversation.</p>
          )}

          {commentPages > 1 && (
            <CommentPagination
              page={commentPage}
              totalPages={commentPages}
              onPageChange={setCommentPage}
            />
          )}
        </section>
      </div>

      <FeedRightRail />
    </div>
  );
}

function CommentPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);
  return (
    <nav
      className="flex items-center justify-center gap-2 pt-2"
      aria-label="Comments pagination"
    >
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`h-9 min-w-9 rounded-lg text-sm font-bold ${
            p === page ? "bg-brand-gradient text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      {page < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          className="px-2 text-sm font-bold text-brand-600"
          aria-label="Next page"
        >
          →
        </button>
      )}
    </nav>
  );
}