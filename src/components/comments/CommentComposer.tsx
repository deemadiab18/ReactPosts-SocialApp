import { useState } from "react";
import CommentEditorModal from "./CommentEditorModal";
import type { ApiUser, Comment } from "../../types/api";

type CommentComposerProps = {
  postId: string;
  userPhoto: string;
  user: ApiUser;
  onSuccess: (comment: Comment) => void;
};

export default function CommentComposer({
  postId,
  userPhoto,
  user,
  onSuccess,
}: CommentComposerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="home-card flex w-full items-center gap-3 p-4 text-left transition hover:border-brand-200 dark:hover:border-brand-600"
        onClick={() => setOpen(true)}
      >
        <img src={userPhoto} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <span className="text-sm text-slate-500">Add to this conversation...</span>
      </button>

      <CommentEditorModal
        key={open ? "comment-open" : "comment-closed"}
        mode="add"
        postId={postId}
        isOpen={open}
        onOpenChange={setOpen}
        user={user}
        onSuccess={onSuccess}
      />
    </>
  );
}