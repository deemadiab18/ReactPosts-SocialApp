import { useEffect, useState } from "react";
import PostEditorModal from "../posts/PostEditorModal";
import type { ApiUser, Post } from "../../types/api";

type CreatePostComposerProps = {
  userPhoto: string;
  userName: string;
  user: ApiUser;
  onSuccess: (post: Post) => void;
};

export default function CreatePostComposer({
  userPhoto,
  userName,
  user,
  onSuccess,
}: CreatePostComposerProps) {
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#create-post",
  );
  const firstName = userName.split(" ")[0] ?? userName;

  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === "#create-post") setOpen(true);
    }
    window.addEventListener("hashchange", onHashChange);
    if (window.location.hash === "#create-post") {
      window.requestAnimationFrame(() => {
        document.getElementById("create-post")?.scrollIntoView({ behavior: "smooth" });
      });
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <button
        type="button"
        id="create-post"
        className="home-card flex w-full items-center gap-3 p-4 text-left transition hover:border-brand-200 dark:hover:border-brand-600"
        onClick={() => setOpen(true)}
      >
        <img src={userPhoto} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
        <span className="text-sm text-slate-500">
          {`What's on your mind, ${firstName}?`}
        </span>
      </button>

      <PostEditorModal
        key={open ? "compose-open" : "compose-closed"}
        mode="add"
        isOpen={open}
        onOpenChange={setOpen}
        user={user}
        onSuccess={onSuccess}
      />
    </>
  );
}