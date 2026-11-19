import ReactLogoMark from "../brand/ReactLogoMark";

export default function AuthHeroPanel() {
  return (
    <aside className="auth-hero relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-brand-dark">
      <div className="auth-hero-rings" aria-hidden />
      <AuthHeroHeader />
      <footer className="relative z-10 mt-auto space-y-4 p-10">
        <blockquote className="max-w-sm rounded-2xl bg-white/95 p-5 text-sm leading-relaxed text-slate-700 shadow-lg">
          &ldquo;The best component ideas start with a conversation.&rdquo;
        </blockquote>
        <span className="inline-block rounded-full bg-brand-gradient px-4 py-2 text-xs font-bold text-white shadow-md">
          Your people are here
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200/80">
          React Posts / Made for connection
        </p>
      </footer>
    </aside>
  );
}

function AuthHeroHeader() {
  return (
    <header className="relative z-10 p-10 pt-12">
      <div className="flex items-center gap-3">
        <ReactLogoMark size="md" className="shadow-md" />
        <span className="text-2xl font-extrabold tracking-tight text-white">React Posts</span>
      </div>
      <h1 className="mt-10 max-w-md text-4xl font-extrabold leading-tight text-white xl:text-[2.65rem]">
        Great devs. Sharp debates. One React community.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-brand-100">
        Find your people, share patterns and ship logs, and turn everyday commits
        into real connections with developers who get hooks, suspense, and server
        components.
      </p>
    </header>
  );
}