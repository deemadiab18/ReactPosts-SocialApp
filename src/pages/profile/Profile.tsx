import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLoader from "../../components/ui/AppLoader";
import { getProfileData, getUserPosts } from "../../api/users";
import FeedRightRail from "../../components/feed/FeedRightRail";
import PostCard from "../../components/posts/PostCard";
import ProfileHeroCard from "../../components/profile/ProfileHeroCard";
import { deletePost } from "../../api/posts";
import PostEditorModal from "../../components/posts/PostEditorModal";
import { useAuth } from "../../hooks/useAuth";
import type { Post, ProfileData } from "../../types/api";
import { attachAuthorIfMissing, isPostOwner, mergePost } from "../../utils/mergePost";

export default function Profile() {
  const { user, updateSession, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getProfileData(user?.photo);
      setProfile(profileRes.data);
      const postsRes = await getUserPosts(profileRes.data._id);
      setPosts(postsRes.data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, [user?.photo]);

  useEffect(() => {
    let active = true;
    (async () => {
      await load();
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, [load]);

  function handlePhotoUpdated(photo: string) {
    if (!profile || !token) return;
    const next = { ...profile, photo };
    setProfile(next);
    const sessionUser = user ?? {
      _id: profile._id,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      photo: profile.photo,
    };
    updateSession(token, { ...sessionUser, photo });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <AppLoader size={80} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="feed-layout">
      <div className="min-w-0 space-y-5">
        <ProfileHeroCard
          profile={profile}
          postCount={posts.length}
          onPhotoUpdated={handlePhotoUpdated}
        />

        <ProfileTabBar />

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
            onSuccess={(updated) => {
              const post = attachAuthorIfMissing(updated, user);
              setPosts((prev) =>
                prev.map((p) => (p._id === post._id ? mergePost(p, post) : p)),
              );
              setEditingPost(null);
            }}
            onDelete={async () => {
              await deletePost(editingPost._id);
              setPosts((prev) => prev.filter((p) => p._id !== editingPost._id));
              setEditingPost(null);
            }}
          />
        )}

        <section className="space-y-4">
          {posts.length === 0 && (
            <div className="home-card p-8 text-center text-sm text-slate-500">
              You have not posted anything yet.
            </div>
          )}
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              variant="feed"
              isOwner={isPostOwner(post, user)}
              onEdit={(p) => setEditingPost(p)}
              onDelete={async (id) => {
                await deletePost(id);
                setPosts((prev) => prev.filter((p) => p._id !== id));
              }}
            />
          ))}
        </section>
      </div>

      <FeedRightRail />
    </div>
  );
}

function ProfileTabBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-brand-700">
      <p className="border-b-2 border-brand-500 pb-2 text-sm font-bold text-brand-700">Posts</p>
      <Link
        to="/change-password"
        className="pb-2 text-sm font-bold text-brand-600 hover:underline"
      >
        Change password
      </Link>
    </div>
  );
}