import { toast } from "@heroui/react";
import { useState } from "react";
import { createComment, updateComment } from "../../api/comments";
import type { ApiUser, Comment } from "../../types/api";
import ComposeEditorModal, {
  type ComposeEditorAuthor,
} from "../ui/ComposeEditorModal";

type CommentEditorModalProps = {
  mode: "add" | "edit";
  postId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
  initialComment?: Comment;
  onSuccess: (comment: Comment) => void;
  onDelete?: () => void | Promise<void>;
};

export default function CommentEditorModal({
  mode,
  postId,
  isOpen,
  onOpenChange,
  user,
  initialComment,
  onSuccess,
  onDelete,
}: CommentEditorModalProps) {
  const [loading, setLoading] = useState(false);
  const variant = mode === "add" ? "add-comment" : "edit-comment";

  const author: ComposeEditorAuthor = {
    photo:
      mode === "edit" && initialComment?.user ? initialComment.user.photo : user.photo,
    name: mode === "edit" && initialComment?.user ? initialComment.user.name : user.name,
    username:
      mode === "edit" && initialComment?.user
        ? initialComment.user.username
        : user.username,
    createdAt: mode === "edit" ? initialComment?.createdAt : undefined,
  };

  async function handleSubmit({ text, file }: { text: string; file: File | null }) {
    const form = new FormData();
    form.append("content", text);
    if (file) form.append("image", file);
    setLoading(true);
    try {
      const response =
        mode === "edit" && initialComment
          ? await updateComment(postId, initialComment._id, form, initialComment, user)
          : await createComment(postId, form, user);
      toast.success(response.message);
      onSuccess(response.data);
      onOpenChange(false);
    } catch {
      toast.danger("Could not save comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ComposeEditorModal
      variant={variant}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      author={author}
      initialText={mode === "edit" ? initialComment?.content : ""}
      initialImageUrl={mode === "edit" ? initialComment?.image : undefined}
      loading={loading}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? onDelete : undefined}
    />
  );
}