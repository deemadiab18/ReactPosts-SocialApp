import { Button } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import AppLoader from "../../components/ui/AppLoader";
import { deletePost, getFollowingFeed, getPosts } from "../../api/posts";
import CreatePostComposer from "../../components/feed/CreatePostComposer";
import FeedRightRail from "../../components/feed/FeedRightRail";
import PostCard from "../../components/posts/PostCard";
import PostEditorModal from "../../components/posts/PostEditorModal";
import { useAuth } from "../../hooks/useAuth";
import type { Post } from "../../types/api";
import { attachAuthorIfMissing, mergePost } from "../../utils/mergePost";

type FeedTab = "forYou" | "following";

export default function Feed() {
  const { user } = useAuth();
  const [tab, setTab] = useState<FeedTab>("forYou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const loadPosts = useCallback(
    async (
      pageNum: number,
      append: boolean,
      feedTab: FeedTab,
      background = false,
    ) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (background) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result =
          feedTab === "following"
            ? await getFollowingFeed(pageNum, 10, user)
            : await getPosts(pageNum, 10, user);

        setPosts((prev) => (append ? [...prev, ...result.posts] : result.posts));
        setNextPage(result.nextPage);
        setError("");
      } catch {
        if (!background && !append) {
          setError(
            feedTab === "following"
              ? "Could not load following feed."
              : "Could not load posts. Try again.",
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      await loadPosts(1, false, tab);
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, [loadPosts, tab]);

  function switchTab(nextTab: FeedTab) {
    if (nextTab === tab) return;
    setPage(1);
    setTab(nextTab);
  }

  async function handleDelete(postId: string) {
    await deletePost(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  function handlePostSaved(incoming: Post) {
    const post = attachAuthorIfMissing(incoming, user);

    setPosts((prev) => {
      const idx = prev.findIndex((p) => p._id === post._id);
      if (idx === -1) return [post, ...prev];
      const copy = [...prev];
      copy[idx] = mergePost(prev[idx], post);
      return copy;
    });
    setEditingPost(null);
    void loadPosts(1, false, tab, true);
  }

  const showInitialLoader = loading && posts.length === 0;

  return (
    <div className="feed-layout">
      <div className="min-w-0 space-y-5">
        <header>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
            Your daily dose of connection
          </h1>
          <div className="mt-4 flex gap-6 border-b border-slate-200 dark:border-brand-700">
            <FeedTabButton
              active={tab === "forYou"}
              label="For you"
              onClick={() => switchTab("forYou")}
            />
            <FeedTabButton
              active={tab === "following"}
              label="Following"
              onClick={() => switchTab("following")}
            />
          </div>
        </header>

        {refreshing && (
          <p className="text-center text-xs font-semibold text-brand-600" role="status">
            Refreshing feed…
          </p>
        )}

        {user && (
          <CreatePostComposer
            userPhoto={user.photo}
            userName={user.name}
            user={user}
            onSuccess={handlePostSaved}
          />
        )}

        {user && editingPost && (
          <PostEditorModal
            key={editingPost._id}
            mode="edit"
            isOpen
            onOpenChange={(open) => {
              if (!open) setEditingPost(null);
            }}
            user={user}
            initialPost={editingPost}
            onSuccess={handlePostSaved}
            onDelete={async () => {
              await handleDelete(editingPost._id);
              setEditingPost(null);
            }}
          />
        )}

        {showInitialLoader ? (
          <div className="flex justify-center py-16">
            <AppLoader size={64} />
          </div>
        ) : (
          <>
            {error && (
              <div className="home-card p-4 text-sm text-red-700">
                {error}
                <Button
                  className="ml-2"
                  size="sm"
                  onPress={() => void loadPosts(page, false, tab)}
                >
                  Retry
                </Button>
              </div>
            )}

            {!error && posts.length === 0 && <EmptyFeedState tab={tab} />}

            <section className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isOwner={post.user?._id === user?._id}
                  onDelete={handleDelete}
                  onEdit={(p) => setEditingPost(p)}
                  variant="feed"
                />
              ))}
            </section>

            {nextPage && (
              <Button
                fullWidth
                variant="secondary"
                className="font-bold"
                isDisabled={loadingMore}
                onPress={() => {
                  const next = page + 1;
                  setPage(next);
                  void loadPosts(next, true, tab);
                }}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            )}
          </>
        )}
      </div>

      <FeedRightRail />
    </div>
  );
}

function FeedTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 pb-2 text-sm font-bold transition ${
        active
          ? "border-brand-500 text-brand-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyFeedState({ tab }: { tab: FeedTab }) {
  return (
    <div className="home-card p-8 text-center">
      <p className="font-bold text-brand-700">
        {tab === "following" ? "No posts from people you follow" : "No posts yet"}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {tab === "following"
          ? "Follow developers to see their updates here."
          : "Be the first to share a React tip with the community."}
      </p>
    </div>
  );
}