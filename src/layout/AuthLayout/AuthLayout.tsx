import { Outlet } from "react-router-dom";
import AuthHeroPanel from "../../components/auth/AuthHeroPanel";
import AuthMobileHeader from "../../components/auth/AuthMobileHeader";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <AuthHeroPanel />
      <section className="flex min-h-screen flex-col">
        <AuthMobileHeader />
        <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}