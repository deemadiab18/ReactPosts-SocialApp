import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const suggestions = [
  {
    name: "Sara Chen",
    username: "sarareact",
    photo: "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
  },
  {
    name: "Omar Hassan",
    username: "omarhooks",
    photo: "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
  },
  {
    name: "Mia Johnson",
    username: "miatsx",
    photo: "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
  },
];

export default function FeedRightRail() {
  return (
    <aside className="feed-rail hidden space-y-4 xl:block">
      <section className="home-card p-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">Who to follow</h2>
        <ul className="mt-4 space-y-3">
          {suggestions.map((person) => (
            <li key={person.username} className="flex items-center gap-3">
              <img src={person.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{person.name}</p>
                <p className="truncate text-xs text-slate-500">@{person.username}</p>
              </div>
              <Button size="sm" className="bg-brand-50 font-bold text-brand-700">
                Follow
              </Button>
            </li>
          ))}
        </ul>
        <Link to="/" className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline">
          Discover more people →
        </Link>
      </section>

      <section className="home-card border-brand-100 bg-brand-50/50 p-4 dark:border-brand-700 dark:bg-brand-800/30">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand-600">A new member</p>
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Your next favorite pattern starts with a conversation.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Keep tabs on conversations and ideas you followed today.
        </p>
      </section>
    </aside>
  );
}