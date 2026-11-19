import ReactLogoMark from "../brand/ReactLogoMark";

export default function AuthMobileHeader() {
  return (
    <header className="border-b border-slate-200 px-4 py-4 lg:hidden">
      <div className="flex items-center gap-2">
        <ReactLogoMark size="sm" />
        <span className="text-lg font-extrabold text-slate-900">React Posts</span>
      </div>
      <p className="auth-mobile-badge mt-3">NEW POSTS | HAPPENING NOW</p>
    </header>
  );
}