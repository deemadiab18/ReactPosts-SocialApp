import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-extrabold text-brand-600">404</h1>
      <p className="mt-2 text-slate-600">This page does not exist.</p>
      <Link to="/" className="mt-4 font-bold text-brand-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}