import type { Comment } from "../../types/api";
import { useAuth } from "../../hooks/useAuth";
import CommentEditorModal from "./CommentEditorModal";

type CommentFormProps = {
  postId: string;
  mode?: "create" | "edit";
  initialComment?: Comment;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: (comment: Comment) => void;
  onCancel?: () => void;
  onDelete?: () => void | Promise<void>;
};

/** @deprecated Prefer CommentEditorModal with isOpen / onOpenChange */
export default function CommentForm({
  postId,
  mode = "create",
  initialComment,
  isOpen = true,
  onOpenChange,
  onSuccess,
  onCancel,
  onDelete,
}: CommentFormProps) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <CommentEditorModal
      mode={mode === "edit" ? "edit" : "add"}
      postId={postId}
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        if (!open) onCancel?.();
      }}
      user={user}
      initialComment={initialComment}
      onSuccess={onSuccess}
      onDelete={onDelete}
    />
  );
}