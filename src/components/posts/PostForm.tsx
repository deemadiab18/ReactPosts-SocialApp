import type { Post } from "../../types/api";
import { useAuth } from "../../hooks/useAuth";
import PostEditorModal from "./PostEditorModal";

type PostFormProps = {
  mode?: "create" | "edit";
  initialPost?: Post;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: (post: Post) => void;
  onCancel?: () => void;
  onDelete?: () => void | Promise<void>;
};

/** @deprecated Prefer PostEditorModal with isOpen / onOpenChange */
export default function PostForm({
  mode = "create",
  initialPost,
  isOpen = true,
  onOpenChange,
  onSuccess,
  onCancel,
  onDelete,
}: PostFormProps) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <PostEditorModal
      mode={mode === "edit" ? "edit" : "add"}
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        if (!open) onCancel?.();
      }}
      user={user}
      initialPost={initialPost}
      onSuccess={onSuccess}
      onDelete={onDelete}
    />
  );
}