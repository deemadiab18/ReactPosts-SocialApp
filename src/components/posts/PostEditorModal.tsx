import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import { useState } from "react";
import { createPost, updatePost } from "../../api/posts";
import type { ApiUser, Post } from "../../types/api";
import { mergePost } from "../../utils/mergePost";
import ComposeEditorModal, {
  type ComposeEditorAuthor,
} from "../ui/ComposeEditorModal";

type PostEditorModalProps = {
  mode: "add" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
  initialPost?: Post;
  onSuccess: (post: Post) => void;
  onDelete?: () => void | Promise<void>;
};

export default function PostEditorModal({
  mode,
  isOpen,
  onOpenChange,
  user,
  initialPost,
  onSuccess,
  onDelete,
}: PostEditorModalProps) {
  const [loading, setLoading] = useState(false);
  const variant = mode === "add" ? "add-post" : "edit-post";

  const author: ComposeEditorAuthor = {
    photo: mode === "edit" && initialPost?.user ? initialPost.user.photo : user.photo,
    name: mode === "edit" && initialPost?.user ? initialPost.user.name : user.name,
    username: mode === "edit" && initialPost?.user ? initialPost.user.username : user.username,
    createdAt: mode === "edit" ? initialPost?.createdAt : undefined,
  };

  async function handleSubmit({ text, file }: { text: string; file: File | null }) {
    const form = new FormData();
    form.append("body", text);
    if (file) form.append("image", file);
    setLoading(true);
    try {
      if (mode === "edit" && initialPost) {
        const response = await updatePost(initialPost._id, form, initialPost);
        onSuccess(mergePost(initialPost, response.data));
        toast.success(response.message);
        onOpenChange(false);
        return;
      }
      const response = await createPost(form, user);
      toast.success(response.message);
      onSuccess(response.data);
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message as string | undefined)
        : undefined;
      toast.danger(message ?? "Could not save post");
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
      initialText={mode === "edit" ? initialPost?.body : ""}
      initialImageUrl={mode === "edit" ? initialPost?.image : undefined}
      loading={loading}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? onDelete : undefined}
    />
  );
}