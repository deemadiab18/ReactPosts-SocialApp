import { Button, toast } from "@heroui/react";
import { useRef, useState } from "react";
import { uploadProfilePhoto } from "../../api/users";
import type { ProfileData } from "../../types/api";
import { resolvePhotoUrl } from "../../utils/resolvePhotoUrl";

type ProfileHeroCardProps = {
  profile: ProfileData;
  postCount: number;
  onPhotoUpdated: (photo: string) => void;
};

export default function ProfileHeroCard({
  profile,
  postCount,
  onPhotoUpdated,
}: ProfileHeroCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handlePhotoChange(file: File | null) {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      onPhotoUpdated(res.data.photo);
      toast.success(res.message);
    } catch {
      toast.danger("Could not update profile photo");
    } finally {
      setUploading(false);
    }
  }

  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const followers = profile.followers ?? 0;
  const following = profile.following ?? 0;

  return (
    <section className="home-card overflow-hidden">
      <div className="profile-cover relative flex min-h-[7.5rem] items-start px-6 pt-4">
        <p className="text-lg font-extrabold text-white drop-shadow-sm sm:text-xl">
          A little curious. Always shipping.
        </p>
      </div>

      <div className="relative px-4 pb-5 pt-2 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <img
            src={resolvePhotoUrl(profile.photo)}
            alt={profile.name}
            className="relative z-10 h-24 w-24 -mt-14 rounded-full border-4 border-white object-cover shadow-md dark:border-brand-800"
          />
          <div className="sm:pb-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handlePhotoChange(e.target.files?.[0] ?? null)}
            />
            <Button
              size="sm"
              variant="secondary"
              className="font-bold"
              isDisabled={uploading}
              onPress={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Change photo"}
            </Button>
          </div>
        </div>

        <h1 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-50">{profile.name}</h1>
        <p className="text-sm font-bold text-brand-600">@{profile.username}</p>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          React developer sharing patterns, libraries, and what ships in production.
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          {joined && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon />
              Joined {joined}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <PinIcon />
            React community
          </span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-6 text-sm">
          <li>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{postCount}</span>
            <span className="ml-1 text-slate-500">posts</span>
          </li>
          <li>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {formatCount(followers)}
            </span>
            <span className="ml-1 text-slate-500">followers</span>
          </li>
          <li>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {formatCount(following)}
            </span>
            <span className="ml-1 text-slate-500">following</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(value);
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}
