import { Button, Modal, TextArea, useOverlayState } from "@heroui/react";
import AppLoader from "./AppLoader";
import { useRef, useState, type FormEvent } from "react";

export type ComposeEditorVariant = "add-post" | "edit-post" | "add-comment" | "edit-comment";

const VARIANT_COPY: Record<
  ComposeEditorVariant,
  {
    title: string;
    subtitle: string;
    primaryLabel: string;
    visibilityNote: string;
    textLabel: string;
    placeholder: string;
    deleteLabel?: string;
  }
> = {
  "add-post": {
    title: "Add post",
    subtitle: "Share something with the community.",
    primaryLabel: "Post",
    visibilityNote: "Your post is visible to everyone.",
    textLabel: "Post",
    placeholder: "What's on your mind?",
  },
  "edit-post": {
    title: "Edit post",
    subtitle: "A fresh thought takes form.",
    primaryLabel: "Save changes",
    visibilityNote: "Changes are visible to everyone.",
    textLabel: "Post",
    placeholder: "What's on your mind?",
    deleteLabel: "Delete post",
  },
  "add-comment": {
    title: "Add comment",
    subtitle: "Join the conversation.",
    primaryLabel: "Comment",
    visibilityNote: "Your comment is visible to everyone.",
    textLabel: "Comment",
    placeholder: "Add to this conversation...",
  },
  "edit-comment": {
    title: "Edit comment",
    subtitle: "Refine what you shared.",
    primaryLabel: "Save changes",
    visibilityNote: "Changes are visible to everyone.",
    textLabel: "Comment",
    placeholder: "Add to this conversation...",
    deleteLabel: "Delete comment",
  },
};

export type ComposeEditorAuthor = {
  photo: string;
  name: string;
  username: string;
  createdAt?: string;
};

type ComposeEditorModalProps = {
  variant: ComposeEditorVariant;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  author: ComposeEditorAuthor;
  initialText?: string;
  initialImageUrl?: string;
  loading?: boolean;
  onSubmit: (payload: { text: string; file: File | null }) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
};

export default function ComposeEditorModal({
  variant,
  isOpen,
  onOpenChange,
  author,
  initialText = "",
  initialImageUrl,
  loading = false,
  onSubmit,
  onDelete,
}: ComposeEditorModalProps) {
  const modalState = useOverlayState({ isOpen, onOpenChange });
  const formKey = `${variant}:${initialText}:${initialImageUrl ?? ""}`;

  return (
    <Modal.Root state={modalState}>
      <Modal.Backdrop>
        <Modal.Container size="lg" className="max-w-xl px-3 sm:px-4">
          <Modal.Dialog className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl dark:border-brand-700 dark:bg-brand-800">
            {isOpen ? (
              <ComposeEditorForm
                key={formKey}
                variant={variant}
                author={author}
                initialText={initialText}
                initialImageUrl={initialImageUrl}
                loading={loading}
                onSubmit={onSubmit}
                onDelete={onDelete}
                onOpenChange={onOpenChange}
              />
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}

type ComposeEditorFormProps = {
  variant: ComposeEditorVariant;
  author: ComposeEditorAuthor;
  initialText: string;
  initialImageUrl?: string;
  loading: boolean;
  onSubmit: (payload: { text: string; file: File | null }) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
};

function ComposeEditorForm({
  variant,
  author,
  initialText,
  initialImageUrl,
  loading,
  onSubmit,
  onDelete,
  onOpenChange,
}: ComposeEditorFormProps) {
  const copy = VARIANT_COPY[variant];
  const [text, setText] = useState(initialText);
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const serverPreview = !imageRemoved ? initialImageUrl : undefined;
  const preview = localPreview ?? serverPreview ?? null;
  const metaLine =
    author.createdAt && variant.startsWith("edit")
      ? `${formatTimeAgo(author.createdAt)} · @${author.username}`
      : `@${author.username}`;

  function pickFile(next: File | null) {
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    if (!next) {
      setLocalPreview(null);
      setFile(null);
      return;
    }
    if (!next.type.startsWith("image/")) return;
    setImageRemoved(false);
    setLocalPreview(URL.createObjectURL(next));
    setFile(next);
  }

  function removeImage() {
    pickFile(null);
    setImageRemoved(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    await onSubmit({ text: text.trim(), file });
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-brand-700">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">{copy.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-brand-700"
          onClick={() => onOpenChange(false)}
        >
          <CloseIcon />
        </button>
      </header>

      <Modal.Body className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={author.photo}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
              {author.name}
            </p>
            <p className="text-xs text-slate-500">{metaLine}</p>
          </div>
        </div>

        <TextArea
          aria-label={copy.textLabel}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={copy.placeholder}
          className="min-h-[120px] rounded-xl border border-slate-200 bg-white text-sm leading-relaxed dark:border-brand-600 dark:bg-brand-900/40"
          rows={5}
        />

        {preview && (
          <img src={preview} alt="" className="max-h-56 w-full rounded-xl object-cover" />
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            className="text-brand-600 hover:text-brand-700"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? "Replace image" : "Add image"}
          </button>
          {preview && (
            <button
              type="button"
              className="text-red-600 hover:text-red-700"
              onClick={removeImage}
            >
              Remove image
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500">{copy.visibilityNote}</p>
      </Modal.Body>

      <Modal.Footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-brand-700">
        {copy.deleteLabel && onDelete ? (
          <button
            type="button"
            className="order-2 text-sm font-bold text-red-600 hover:text-red-700 sm:order-1"
            onClick={() => void onDelete()}
          >
            {copy.deleteLabel}
          </button>
        ) : (
          <span className="hidden sm:block sm:flex-1" />
        )}

        <div className="order-1 flex w-full gap-2 sm:order-2 sm:ml-auto sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            className="min-w-[7rem] flex-1 font-bold sm:flex-none"
            onPress={() => onOpenChange(false)}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-[7rem] flex-1 bg-brand-700 font-bold text-white sm:flex-none"
            isDisabled={loading || !text.trim()}
          >
            {loading ? (
              <AppLoader size={18} colors={["#ffffff", "#9ad6e8"]} color="#ffffff" />
            ) : null}
            {copy.primaryLabel}
          </Button>
        </div>
      </Modal.Footer>
    </form>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
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